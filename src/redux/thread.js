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
	(boardId, threadId) => UserData.getTrackedThreads(boardId, threadId) ? true : false,
	'isTracked'
)

redux.on('CHAN', 'GET_THREAD_COMMENTS', (state, { thread }) => ({
  ...state,
	thread
}))

redux.on('THREAD_TRACKER', 'TRACK_THREAD', (state, { thread }) => {
	if (state.thread &&
		thread.id === state.thread.id &&
		thread.board.id === state.thread.board.id) {
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
		thread.board.id === state.thread.board.id) {
		return {
			...state,
			isTracked: false
		}
	}
	return state
})

export default redux.reducer()