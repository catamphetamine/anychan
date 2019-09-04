import { ReduxModule } from 'react-website'

import _getBoards from '../chan-api/getBoards'
import _getAllBoards from '../chan-api/getAllBoards'
import _getThreads from '../chan-api/getThreads'
import _getThreadComments from '../chan-api/getThreadComments'

const redux = new ReduxModule()

export const getBoards = redux.action(
	() => async http => await _getBoards({ http }),
	(state, result) => ({
		...state,
		...result
	})
)

export const getAllBoards = redux.action(
	() => async http => await _getAllBoards({ http }),
	(state, result) => ({
		...state,
		allBoards: result
	})
)

export const getThreads = redux.action(
	(boardId, censoredWords, locale) => async http => {
		return await _getThreads({ boardId, censoredWords, locale, http })
	},
	(state, { boardId, threads }) => ({
		...state,
		threads,
		// `8ch.net` has too many boards (20 000) so they're not parsed.
		// For `8ch.net` `boards` contains only a small amount of most active boards.
		board: state.boards.find(_ => _.id === boardId) || { id: boardId, name: boardId }
	})
)

export const getThreadComments = redux.action(
	(boardId, threadId, censoredWords, locale) => async http => {
		return await _getThreadComments({ boardId, threadId, censoredWords, locale, http })
	},
	(state, { boardId, thread }) => {
		// `8ch.net` has too many boards (20 000) so they're not parsed.
		// For `8ch.net` `boards` contains only a small amount of most active boards.
		const board = state.boards.find(_ => _.id === boardId) || { id: boardId, name: boardId }
		// 2ch.hk doesn't specify the limits in board settings themselves.
		// Instead, it returns the limits as part of "get thread" API response.
		if (thread.maxCommentLength) {
			// Maximum allowed comment length.
			board.maxCommentLength = thread.maxCommentLength
			delete thread.maxCommentLength
			// Maximum allowed attachments size.
			board.maxAttachmentsSize = thread.maxAttachmentsSize
			delete thread.maxAttachmentsSize
		}
		return {
			...state,
			board,
			thread
		}
	}
)

export default redux.reducer()