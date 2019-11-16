import { ReduxModule } from 'react-website'

import UserData from '../UserData/UserData'

const redux = new ReduxModule('THREAD')

export const setVirtualScrollerState = redux.simpleAction(
	(state, virtualScrollerState) => ({ ...state, virtualScrollerState })
)

export const setScrollPosition = redux.simpleAction(
	(state, scrollPosition) => ({ ...state, scrollPosition })
)

export const isThreadTracked = redux.simpleAction(
	(state, { boardId, threadId }) => {
		return {
			...state,
			isTracked: UserData.getTrackedThreads(boardId, threadId) ? true : false
		}
	}
)

redux.on('CHAN', 'GET_THREAD_COMMENTS', (state, { thread, board }) => ({
  ...state,
	thread,
	board
}))

redux.on('THREAD_TRACKER', 'TRACK_THREAD', (state, { thread }) => {
	if (state.thread &&
		thread.id === state.thread.id &&
		thread.board.id === state.thread.boardId) {
		return {
			...state,
			isTracked: true
		}
	}
	return state
})

redux.on('THREAD_TRACKER', 'UNTRACK_THREAD', (state, { thread }) => {
	if (state.thread &&
		thread.id === state.thread.id &&
		thread.board.id === state.thread.boardId) {
		return {
			...state,
			isTracked: false
		}
	}
	return state
})

export default redux.reducer()