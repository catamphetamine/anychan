import { ReduxModule } from 'react-pages'

import addSubscribedThread from '../utility/subscribedThread/addSubscribedThread.js'
import sortSubscribedThreads from '../utility/subscribedThread/sortSubscribedThreads.js'
import reSortSubscribedThreads from '../utility/subscribedThread/reSortSubscribedThreads.js'
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

export const updateSubscribedThreadState = redux.action(
	(channelId, threadId, prevSubscribedThreadState, newSubscribedThreadState, { userData }) => async () => {
		// Update `subscribedThreadsStats` record in User Data.
		userData.setSubscribedThreadState(
			channelId,
			threadId,
			newSubscribedThreadState
		)

		const hasChangedToNoNewComments = prevSubscribedThreadState.newCommentsCount > 0 &&
			newSubscribedThreadState.newCommentsCount === 0

		const hasChangedToNoNewReplies = prevSubscribedThreadState.newRepliesCount > 0 &&
			newSubscribedThreadState.newRepliesCount === 0

		// See if the order of subscribed threads has changed
		// as a result of this subscribed thread no longer having
		// new comments / new replies.
		// If the order of subscribed threads has changed,
		// update subscribed threads in User Data and in Redux state,
		// so that they get re-rendered.
		const hasOrderChanged = reSortSubscribedThreads({ userData })

		return {
			channelId,
			threadId,
			subscribedThreads: hasChangedToNoNewComments || hasChangedToNoNewReplies || hasOrderChanged ? userData.getSubscribedThreads() : undefined
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
		subscribedThreadState,
		userData,
		subscribedThreadsUpdater
	}) => async () => {
		// Add subscribed thread record to User Data.
		userData.addSubscribedThread(subscribedThread)
		userData.addSubscribedThreadIdForChannel(subscribedThread.channel.id, subscribedThread.id)

		// Add `subscribedThreadsStats` record to User Data.
		userData.setSubscribedThreadState(
			subscribedThread.channel.id,
			subscribedThread.id,
			subscribedThreadState
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
		const subscribedThreadState = userData.getSubscribedThreadState(subscribedThread.channel.id, subscribedThread.id)

		userData.removeSubscribedThread(subscribedThread)
		userData.removeSubscribedThreadIdFromChannel(subscribedThread.channel.id, subscribedThread.id)
		userData.removeSubscribedThreadState(subscribedThread.channel.id, subscribedThread.id)

		// No need to notify Subscribed Threads Updater
		// because it will review the list of subscribed threads upon running anyway.

		const subscribedThreads = userData.getSubscribedThreads()

		return {
			// `subscribedThreadState` property is read in `onUnsubscribeToThread()` function
			// of `<SubscribedThread/>` component in order to backup `subscribedThreadState`
			// in case of undoing the unsubscribing from the thread.
			subscribedThreadState,
			subscribedThreads
		}
	},
	(state, { subscribedThreads }) => ({
		...state,
		subscribedThreads
	})
)

// "Update is in progress for thread" events are emitted
// in case the application would prefer to show some kind of a
// status indicator for subscribed threads list items in sidebar.
// For example, when a thread is being updated, it could show a spinner of some sort.
export const subscribedThreadsUpdateInProgressForThread = redux.simpleAction(
	'UPDATE_IN_PROGRESS_FOR_THREAD',
	(state, { channelId, threadId }) => ({
		...state,
		subscribedThreadsUpdateInProgress: true,
		subscribedThreadsUpdateChannelId: channelId,
		subscribedThreadsUpdateThreadId: threadId
	})
)

// "Subscribed threads update is not in progress" event is emitted
// in case the application would prefer to show or hide some kind of a
// status indicator for subscribed threads list in sidebar.
// For example, it could show or hide an "updating" spinner of some sort.
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