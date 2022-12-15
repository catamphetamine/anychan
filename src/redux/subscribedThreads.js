import { ReduxModule } from 'react-pages'

import getUserData from '../UserData.js'
import { getSubscribedThreadsUpdater } from '../utility/globals.js'
import addSubscribedThread from '../utility/subscribedThread/addSubscribedThread.js'

const redux = new ReduxModule('SUBSCRIBED_THREADS')

export const getSubscribedThreads = redux.simpleAction(
	'GET_SUBSCRIBED_THREADS',
	(state, { userData = getUserData() } = {}) => {
		const subscribedThreads = userData.getSubscribedThreads()
		return {
			...state,
			subscribedThreads
		}
	}
)

export const subscribeToThread = redux.action(
	(thread, {
		channel,
		userData = getUserData(),
		timer,
		subscribedThreadsUpdater
	}) => async () => {
		addSubscribedThread(thread, { channel, userData, timer, subscribedThreadsUpdater })
		return userData.getSubscribedThreads()
	},
	(state, subscribedThreads) => ({
		...state,
		subscribedThreads
	})
)

// `restoreSubscribedThread()` function is called in cases when a user accidentally
// unsubscribes from a thread by clicking the "x" button, and then clicks "Undo",
// which restores the subscribed thread record.
export const restoreSubscribedThread = redux.action(
	(subscribedThread, {
		subscribedThreadStats,
		userData = getUserData(),
		subscribedThreadsUpdater = getSubscribedThreadsUpdater()
	}) => async () => {
		// Add subscribed thread record to User Data.
		userData.addSubscribedThread(subscribedThread)
		userData.addSubscribedThreadIdForChannel(subscribedThread.channel.id, subscribedThread.id)

		// Add `subscribedThreadsState` record to User Data.
		userData.setSubscribedThreadStats(
			subscribedThread.channel.id,
			subscribedThread.id,
			subscribedThreadStats
		)

		// Notify Subscribed Threads Updater
		// that it should re-calculate the time of next update.
		subscribedThreadsUpdater.reset()

		return userData.getSubscribedThreads()
	},
	(state, subscribedThreads) => ({
		...state,
		subscribedThreads
	})
)

export const unsubscribeFromThread = redux.action(
	(subscribedThread, {
		userData = getUserData()
	} = {}) => async () => {
		// Get subscribed thread stats record in order to return it later.
		const subscribedThreadStats = userData.getSubscribedThreadStats(subscribedThread.channel.id, subscribedThread.id)

		userData.removeSubscribedThread(subscribedThread)
		userData.removeSubscribedThreadIdFromChannel(subscribedThread.channel.id, subscribedThread.id)
		userData.removeSubscribedThreadStats(subscribedThread.channel.id, subscribedThread.id)

		// No need to notify Subscribed Threads Updater
		// because it will review the list of subscribed threads upon running anyway.

		const subscribedThreads = userData.getSubscribedThreads()

		return {
			// `subscribedThreadStats` property is read in `onUnsubscribeToThread()` function
			// of `<SubscribedThread/>` component in order to backup `subscribedThreadStats`
			// in case of undoing the unsubscribing from the thread.
			subscribedThreadStats,
			subscribedThreads
		}
	},
	(state, { subscribedThreads }) => ({
		...state,
		subscribedThreads
	})
)

export const subscribedThreadsUpdateInProgress = redux.simpleAction(
	'UPDATE_IN_PROGRESS',
	(state) => ({
		...state,
		subscribedThreadsUpdateInProgress: true
	})
)

export const subscribedThreadsUpdateInProgressForThread = redux.simpleAction(
	'UPDATE_IN_PROGRESS_FOR_THREAD',
	(state, { channelId, threadId }) => ({
		...state,
		subscribedThreadsUpdateInProgress: true,
		subscribedThreadsUpdateChannelId: channelId,
		subscribedThreadsUpdateThreadId: threadId
	})
)

export const subscribedThreadsUpdateNotInProgress = redux.simpleAction(
	'UPDATE_NOT_IN_PROGRESS',
	(state) => ({
		...state,
		subscribedThreadsUpdateInProgress: false,
		subscribedThreadsUpdateIsInitial: false,
		subscribedThreadsUpdateChannelId: undefined,
		subscribedThreadsUpdateThreadId: undefined
	})
)

export default redux.reducer({
	subscribedThreads: [],
	subscribedThreadsUpdateInitial: true
})
