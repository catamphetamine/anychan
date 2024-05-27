import type { Thread, UserData, Dispatch, SubscribedThread, SubscribedThreadState } from '@/types'
import type SubscribedThreadsUpdater from '../SubscribedThreadsUpdater/SubscribedThreadsUpdater.js'

import { getSubscribedThreadsUpdater } from '../globals.js'
import sortSubscribedThreads from './sortSubscribedThreads.js'
import createSubscribedThreadRecord from './createSubscribedThreadRecord.js'
import createSubscribedThreadStateRecord from './createSubscribedThreadStateRecord.js'

import { getSubscribedThreads } from '../../redux/subscribedThreads.js'

import { Timer } from 'web-browser-timer'

export default function addSubscribedThread({
	thread,
	subscribedThread,
	subscribedThreadState,
	userData,
	dispatch,
	subscribedThreadsUpdater,
	timer = new Timer()
}: {
	thread?: Thread,
	subscribedThread?: SubscribedThread,
	subscribedThreadState?: SubscribedThreadState,
	userData: UserData,
	dispatch: Dispatch,
	subscribedThreadsUpdater?: SubscribedThreadsUpdater
	timer?: Timer
}) {
	if (thread && !subscribedThread && !subscribedThreadState) {
		const now = new Date(timer.now())

		// Create subscribed thread record.
		subscribedThread = createSubscribedThreadRecord(thread, {
			addedAt: now,
			userData
		})

		// Create subscribed thread state record.
		subscribedThreadState = createSubscribedThreadStateRecord(thread, {
			refreshedAt: now,
			userData
		})
	}

	if (!subscribedThread) {
		throw new Error('`subscribedThread` or `thread` is required')
	}

	if (!subscribedThreadState) {
		throw new Error('`subscribedThreadState` or `thread` is required')
	}

	// Add subscribed thread record to User Data.
	userData.addSubscribedThread(subscribedThread)
	userData.addSubscribedThreadIdForChannel(subscribedThread.channel.id, subscribedThread.id)

	// Add `subscribedThreadsStats` record to User Data.
	userData.setSubscribedThreadState(
		subscribedThread.channel.id,
		subscribedThread.id,
		subscribedThreadState
	)

	// Sort the list of subscribed threads.
	// Remove old expired subscribed threads.
	// Sorting subscribed threads uses `subscribedThreadState` info,
	// that's why it's performed at the end of this function.
	sortAndCleanUpExpiredSubscribedThreads({ userData, timer })

	// Perfoms any required sync-ups after subscribing to a thread.
	onSubscribedToThread({ subscribedThreadsUpdater, dispatch, userData })
}

// Perfoms any required sync-ups after subscribing to a thread.
function onSubscribedToThread({
	subscribedThreadsUpdater = getSubscribedThreadsUpdater(),
	dispatch,
	userData
}: {
	subscribedThreadsUpdater: SubscribedThreadsUpdater,
	dispatch: Dispatch,
	userData: UserData
}) {
	// Notify Subscribed Threads Updater
	// that it should re-calculate the time of next update.
	subscribedThreadsUpdater.reset()

	// Refresh the list of subscribed threads in the sidebar.
	dispatch(getSubscribedThreads({ userData }))
}

// Clean up expired threads a month after they've expired.
const CLEAN_UP_EXPIRED_THREADS_AFTER = 30 * 24 * 60 * 60 * 1000

/**
 * Sorts subscribed threads.
 * Removes old expired subscribed threads.
 */
function sortAndCleanUpExpiredSubscribedThreads({ userData, timer }: { userData: UserData, timer: Timer }) {
	const subscribedThreads = userData.getSubscribedThreads()
		.filter(({ expiredAt }) => expiredAt ? (timer.now() - expiredAt.getTime() < CLEAN_UP_EXPIRED_THREADS_AFTER) : true)
	sortSubscribedThreads(subscribedThreads, { userData })
	// Doesn't update the subscribed threads "index" collection,
	// but that "index" collection has already cleared itself on thread expiration,
	// so the "index" collection stays consistent with the data collection.
	userData.setSubscribedThreads(subscribedThreads)
}