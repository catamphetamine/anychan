import type { State } from '@/types'

import { ReduxModule } from 'react-pages'

import reSortSubscribedThreads from '../utility/subscribedThread/reSortSubscribedThreads.js'

	// This redux module name is used in tests so don't remove it.
const redux = new ReduxModule<State['subscribedThreads']>('SUBSCRIBED_THREADS')

export const getSubscribedThreads = redux.simpleAction(
	// This redux action name is used in tests so don't remove it.
	'GET_SUBSCRIBED_THREADS',
	(state, { userData }) => {
		return {
			...state,
			// Subscribed threads list is stored in User Data being already sorted.
			subscribedThreads: userData.getSubscribedThreads()
		}
	}
)

export const updateSubscribedThreadState = redux.simpleAction(
	(state, {
		channelId,
		threadId,
		prevSubscribedThreadState,
		newSubscribedThreadState,
		userData
	}) => {
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

		const newSubscribedThreads = hasChangedToNoNewComments || hasChangedToNoNewReplies || hasOrderChanged ? userData.getSubscribedThreads() : undefined

		const subscribedThreads = newSubscribedThreads || state.subscribedThreads

		// Update the subscribed thread record's "object reference"
		// so that `<SubscribedThread/>` React component re-renders itself
		// for this specific subscribed thread.
		if (!newSubscribedThreads) {
			let i = 0
			while (i < subscribedThreads.length) {
				const subscribedThread = subscribedThreads[i]
				if (subscribedThread.id === threadId && subscribedThread.channel.id === channelId) {
					subscribedThreads[i] = { ...subscribedThread }
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

// "Update is in progress for thread" events are emitted
// in case the application would prefer to show some kind of a
// status indicator for subscribed threads list items in sidebar.
// For example, when a thread is being updated, it could show a spinner of some sort.
export const subscribedThreadsUpdateInProgressForThread = redux.simpleAction(
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
	(state) => ({
		...state,
		subscribedThreadsUpdateInProgress: false,
		// subscribedThreadsUpdateInitial: false,
		subscribedThreadsUpdateChannelId: undefined,
		subscribedThreadsUpdateThreadId: undefined
	})
)

export default redux.reducer({
	subscribedThreads: [],
	// subscribedThreadsUpdateInitial: true
})