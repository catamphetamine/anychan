import { ReduxModule } from 'react-pages'

import getUserData from '../UserData.js'

const redux = new ReduxModule('CHANNEL')

export const setVirtualScrollerState = redux.simpleAction(
	(state, virtualScrollerState) => ({ ...state, virtualScrollerState })
)

export const setScrollPosition = redux.simpleAction(
	(state, scrollPosition) => ({ ...state, scrollPosition })
)

export const setInitialLatestSeenThreadId = redux.simpleAction(
	(state, initialLatestSeenThreadId) => ({ ...state, initialLatestSeenThreadId })
)

export const setChannelView = redux.simpleAction(
	(state, channelView) => ({ ...state, channelView })
)

export const resetState = redux.simpleAction(
	(state) => ({})
)

export const getSubscribedThreadIdsForChannel = redux.simpleAction(
	(state, { channelId, userData = getUserData() }) => ({
		...state,
		subscribedThreadIds: userData.getSubscribedThreadIdsForChannel(channelId)
	})
)

export default redux.reducer()