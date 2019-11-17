import { ReduxModule } from 'react-pages'

import getMessages from '../messages'

import _getBoards from '../api/getBoards'
import _getThreads from '../api/getThreads'
import _getThread from '../api/getThread'
import _vote from '../api/vote'

import UserData from '../UserData/UserData'

const redux = new ReduxModule('CHAN')

export const getBoards = redux.action(
	(options = {}) => async http => await _getBoards({ http, all: options.all }),
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
	(boardId, censoredWords, locale) => async http => {
		// `boardId` and `threads` from `result` are also used in `threadTracker.js`.
		return await _getThreads({
			boardId,
			censoredWords,
			messages: getMessages(locale),
			http
		})
	},
	(state, { boardId, threads }) => {
		// Get the current `board`.
		const board = getBoardById(state.boards, boardId, state.board)
		// `2ch.hk` doesn't specify most of the board settings in `/boards.json` API response.
		// Instead, it returns the board settings as part of "get threads" and
		// "get thread comments" API responses.
		populateBoardInfo(board, threads[0])
		for (const thread of threads) {
			delete thread.board
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
	(boardId, threadId, censoredWords, locale) => async http => {
		return await _getThread({
			boardId,
			threadId,
			censoredWords,
			messages: getMessages(locale),
			http
		})
	},
	(state, { boardId, thread }) => {
		// Get the current `board`.
		const board = getBoardById(state.boards, boardId, state.board)
		// `2ch.hk` doesn't specify most of the board settings in `/boards.json` API response.
		// Instead, it returns the board settings as part of "get threads" and
		// "get thread comments" API responses.
		populateBoardInfo(board, thread)
		return {
			...state,
			board,
			thread
		}
	}
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
		UserData.addCommentVotes(boardId, threadId, commentId, up)
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

function populateBoardInfo(board, thread) {
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