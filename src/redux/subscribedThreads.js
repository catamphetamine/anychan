import { ReduxModule } from 'react-pages'

import addSubscribedThread from '../utility/subscribedThread/addSubscribedThread.js'
import sortSubscribedThreads from '../utility/subscribedThread/sortSubscribedThreads.js'
import onSubscribedThreadsChanged from '../utility/subscribedThread/onSubscribedThreadsChanged.js'

const redux = new ReduxModule('SUBSCRIBED_THREADS')

export const getSubscribedThreads = redux.simpleAction(
	'GET_SUBSCRIBED_THREADS',
	(state, { userData }) => {
		return {
			...state,
			// Subscribed threads list is stored in User Data being already sorted.
			subscribedThreads: userData.getSubscribedThreads()
		}
	}
)

export const subscribeToThread = redux.action(
	(thread, {
		channel,
		userData,
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

export const updateSubscribedThreadStats = redux.action(
	(channelId, threadId, prevSubscribedThreadStats, newSubscribedThreadStats, { userData }) => async () => {
		// Update `subscribedThreadsStats` record in User Data.
		userData.setSubscribedThreadStats(
			channelId,
			threadId,
			newSubscribedThreadStats
		)

		// See if the order of subscribed threads has changed
		// as a result of this subscribed thread no longer having
		// new comments / new replies.
		// If the order of subscribed threads has changed,
		// update subscribed threads in User Data and in Redux state,
		// so that they get re-rendered.
		const newSubscribedThreads = onSubscribedThreadsChanged({
			sort: true,
			userData
		})

		return {
			channelId,
			threadId,
			subscribedThreads: newSubscribedThreads
		}
	},
	(state, { channelId, threadId, subscribedThreads: newSubscribedThreads }) => {
		const subscribedThreads = newSubscribedThreads || state.subscribedThreads

		// Update the subscribed thread record's "object reference"
		// so that `<SubscribedThread/>` React component re-renders itself
		// for this specific subscribed thread.
		if (!newSubscribedThreads) {
			let i = 0
			while (i < subscribedThreads.length) {
				const thread = subscribedThreads[i]
				if (thread.id === threadId && thread.channel.id === channelId) {
					subscribedThreads[i] = { ...thread }
					break
				}
				i++
			}
		}

		// Return the updated list of subscribed threads.
		return {
			...state,
			subscribedThreads
		}
	}
)

// `restoreSubscribedThread()` function is called in cases when a user accidentally
// unsubscribes from a thread by clicking the "x" button, and then clicks "Undo",
// which restores the subscribed thread record.
export const restoreSubscribedThread = redux.action(
	(subscribedThread, {
		subscribedThreadStats,
		userData,
		subscribedThreadsUpdater
	}) => async () => {
		// Add subscribed thread record to User Data.
		userData.addSubscribedThread(subscribedThread)
		userData.addSubscribedThreadIdForChannel(subscribedThread.channel.id, subscribedThread.id)

		// Add `subscribedThreadsStats` record to User Data.
		userData.setSubscribedThreadStats(
			subscribedThread.channel.id,
			subscribedThread.id,
			subscribedThreadStats
		)

		// Sort subscribed threads.
		const subscribedThreads = userData.getSubscribedThreads()
		sortSubscribedThreads(subscribedThreads, { userData })
		userData.setSubscribedThreads(subscribedThreads)

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
	(subscribedThread, { userData }) => async () => {
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