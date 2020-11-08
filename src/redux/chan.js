import { ReduxModule } from 'react-pages'

import getMessages from '../messages'

// import _getBoards from '../api/getBoards'
import _getBoardsCached from '../api/cached/getBoards'
import _getThreads from '../api/getThreads'
import _getThread from '../api/getThread'
import _vote from '../api/vote'

import UserData from '../UserData/UserData'

const redux = new ReduxModule('CHAN')

// export const getBoards = redux.action(
// 	(options = {}) => async http => await _getBoards({ http, all: options.all }),
// 	(state, result) => ({
// 		...state,
// 		// `result` has `boards` and potentially other things
// 		// like `boardsByCategory` and `boardsByPopularity`.
// 		// Also contains `allBoards` object in case of `all: true`.
// 		...result
// 	})
// )

export const getBoards = redux.action(
	(options = {}) => async http => await _getBoardsCached({
		// In case of adding new options here,
		// also add them in `./src/api/cached/getBoards.js`.
		http,
		all: options.all
	}),
	(state, result) => ({
		...state,
		// `result` has `boards` and potentially other things
		// like `boardsByCategory` and `boardsByPopularity`.
		// Also contains `allBoards` object in case of `all: true`.
		...result
	})
)

export const getThreads = redux.action(
	'GET_THREADS',
	(boardId, { censoredWords, locale }) => async http => {
		const threads = await _getThreads({
			boardId,
			censoredWords,
			messages: getMessages(locale),
			http
		})
		// `boardId` and `threads` are also used in `threadTracker.js`.
		return { boardId, threads }
	},
	(state, { boardId, threads }) => {
		// Get the current `board`.
		const board = getBoardById(state.boards, boardId, state.board)
		// `2ch.hk` doesn't specify most of the board settings in `/boards.json` API response.
		// Instead, it returns the board settings as part of "get threads" and
		// "get thread comments" API responses.
		if (threads.length > 0) {
			populateBoardInfoFromThreadData(board, threads[0])
			for (const thread of threads) {
				delete thread.board
				setThreadInfo(thread, board)
			}
		}
		return {
			...state,
			board,
			threads
		}
	}
)

export const getThread = redux.action(
	'GET_THREAD_COMMENTS',
	(boardId, threadId, { censoredWords, locale }) => async http => {
		return await _getThread({
			boardId,
			threadId,
			censoredWords,
			messages: getMessages(locale),
			http
		})
	},
	(state, thread) => {
		// Get the current `board`.
		const board = getBoardById(state.boards, thread.boardId, state.board)
		// `2ch.hk` doesn't specify most of the board settings in `/boards.json` API response.
		// Instead, it returns the board settings as part of "get threads" and
		// "get thread comments" API responses.
		populateBoardInfoFromThreadData(board, thread)
		setThreadInfo(thread, board)
		return {
			...state,
			board,
			thread,
			threadRefreshedAt: Date.now()
		}
	}
)

export const refreshThread = redux.action(
	'REFRESH_THREAD',
	(thread, { censoredWords, locale }) => async http => {
		// Testing.
		// await new Promise(_ => setTimeout(_, 5 * 1000))
		// const updatedThread = { ...thread }
		const updatedThread = await _getThread({
			boardId: thread.boardId,
			threadId: thread.id,
			censoredWords,
			messages: getMessages(locale),
			http
		})
		mergeThreadComments(thread, updatedThread)
		return updatedThread
	},
	(state, thread) => {
		// Get the current `board`.
		const board = getBoardById(state.boards, thread.boardId, state.board)
		setThreadInfo(thread, board)
		return {
			...state,
			thread,
			threadRefreshedAt: Date.now()
		}
	}
)

export const currentThreadExpired = redux.simpleAction(
	'CURRENT_THREAD_EXPIRED',
	// `thread` Redux action argument is used in `threadTracker.js`.
	(state) => ({
		...state,
		thread: {
			...state.thread,
			expired: true
		}
	})
)

export const vote = redux.action(
	({ up, boardId, threadId, commentId }) => async http => {
		const voteAccepted = await _vote({
			up,
			boardId,
			commentId,
			http
		})
		// If the vote has been accepted then mark this comment as "voted" in user data.
		// If the vote hasn't been accepted due to "already voted"
		// then also mark this comment as "voted" in user data.
		UserData.addCommentVotes(boardId, threadId, commentId, up ? 1 : -1)
		return voteAccepted
	}
)

export default redux.reducer()

function getBoardById(boards, boardId, board) {
	// Get the current `board`.
	// `8ch.net` has too many boards (20 000) so the full boards list isn't fetched:
	// instead `boards` contains only a small amount of most active boards,
	// hence the dummy board workaround.
	const board_ = boards.find(_ => _.id === boardId)
	if (board_) {
		return board_
	}
	// A very minor optimization for `8ch.net` case to prevent Redux state property
	// from changing its "reference" while staying "deeply equal" to the previous one.
	if (board && board.id === boardId) {
		return board
	}
	// Return a dummy board.
	return { id: boardId, title: boardId }
}

function populateBoardInfoFromThreadData(board, thread) {
	// `2ch.hk` doesn't specify most of the board settings in `/boards.json` API response.
	// Instead, it returns the board settings as part of "get threads" and
	// "get thread comments" API responses.
	// Also chans like `lynxchan` having userboards return board title
	// as part of "get thread comments" API response.
	if (thread.board) {
		for (const key of Object.keys(thread.board)) {
			board[key] = thread.board[key]
		}
		delete thread.board
	}
}

// Some comment properties are set here
// rather than in `addCommentProps.js`
// because here it requires access to board props
// which aren't available in `addCommentProps.js`.
function setThreadInfo(thread, board) {
	// `2ch.hk` and `4chan.org` provide `bumpLimit` info.
	// Mark all comments that have reached that "bump limit".
	if (board.bumpLimit) {
		if (thread.comments.length >= board.bumpLimit) {
			let i = board.bumpLimit - 1
			while (i < thread.comments.length) {
				// `isBumpLimitReached` is used in `<CommentAuthor/>`
				// to show a "sinking ship" badge.
				thread.comments[i].isBumpLimitReached = true
				i++
			}
		}
	}
}

/**
 * Some comments might have been removed by moderators
 * in-between thread updates. This function preserves
 * such removed comments.
 * @param  {Thread} thread — Thread before being updated.
 * @param  {Thread} updatedThread — Thread after being updated. Its `comments` can be changed.
 */
function mergeThreadComments(thread, updatedThread) {
	let i = 0
	while (i < thread.comments.length) {
		const comment = thread.comments[i]
		const sameComment = updatedThread.comments[i]
		if (comment.id === sameComment.id) {
			// Migrate `comment.content` so that it doesn't need to be re-parsed.
			if (sameComment.updatedAt === comment.updatedAt) {
				sameComment.content = comment.content
				sameComment.contentPreview = comment.contentPreview
				sameComment.parseContent = comment.parseContent
			} else {
				// If `comment.content` has changed (for example, if the comment
				// was edited by a moderator), then re-parse its `content`.
				sameComment.parseContent()
			}
		} else {
			// Restore the now-removed comment (and mark it as "removed").
			comment.removed = true
			updatedThread.comments.splice(i, 0, comment)
		}
		i++
	}
}