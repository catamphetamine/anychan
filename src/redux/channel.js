import { ReduxModule } from 'react-pages'

const redux = new ReduxModule('CHANNEL')

export const setSearchResultsState = redux.simpleAction(
	(state, searchResultsState) => ({ ...state, searchResultsState })
)

export const setVirtualScrollerState = redux.simpleAction(
	(state, virtualScrollerState) => ({ ...state, virtualScrollerState })
)

export const setScrollPosition = redux.simpleAction(
	(state, scrollPosition) => ({ ...state, scrollPosition })
)

export const setInitialLatestSeenThreadId = redux.simpleAction(
	(state, initialLatestSeenThreadId) => ({ ...state, initialLatestSeenThreadId })
)

export const setChannelLayout = redux.simpleAction(
	(state, channelLayout) => ({ ...state, channelLayout })
)

export const setChannelSorting = redux.simpleAction(
	(state, channelSorting) => ({ ...state, channelSorting })
)

export const updateCreateThreadState = redux.simpleAction(
	(state, createThreadStateUpdate) => ({
		...state,
		createThreadState: {
			...state.createThreadState,
			...createThreadStateUpdate
		}
	})
)

export const resetCreateThreadState = redux.simpleAction(
	(state, createThreadStateUpdate) => ({
		...state,
		createThreadState: undefined
	})
)

export const resetState = redux.simpleAction(
	(state) => ({})
)

export const getSubscribedThreadIdsForChannel = redux.simpleAction(
	(state, { channelId, userData }) => ({
		...state,
		subscribedThreadIds: userData.getSubscribedThreadIdsForChannel(channelId)
	})
)

export default redux.reducer()