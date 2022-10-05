import getUserData from '../../UserData.js'

import { getSubscribedThreadsUpdater } from '../globals.js'
import sortSubscribedThreads from './sortSubscribedThreads.js'
import createSubscribedThreadRecord from './createSubscribedThreadRecord.js'
import createSubscribedThreadStatsRecord from './createSubscribedThreadStatsRecord.js'

import { Timer } from 'web-browser-timer'

export default function addSubscribedThread(thread, {
	channel,
	userData = getUserData(),
	subscribedThreadsUpdater = getSubscribedThreadsUpdater(),
	timer = new Timer()
}) {
	// Create subscribed thread record.
	const subscribedThread = createSubscribedThreadRecord(thread, { channel, userData })

	// Set `addedAt` date.
	subscribedThread.addedAt = new Date(timer.now())

	// Add subscribed thread record to User Data.
	userData.addSubscribedThread(subscribedThread)
	userData.addSubscribedThreadIdForChannel(thread.channelId, thread.id)

	// Add `subscribedThreadsState` record to User Data.
	userData.setSubscribedThreadStats(
		thread.channelId,
		thread.id,
		createSubscribedThreadStatsRecord(thread, {
			refreshedAt: subscribedThread.addedAt,
			userData
		})
	)

	// Sort the list of subscribed threads.
	// Remove old expired subscribed threads.
	// Sorting subscribed threads uses `subscribedThreadStats` info,
	// that's why it's performed at the end of this function.
	sortAndCleanUpExpiredSubscribedThreads({ userData, timer })

	// Notify Subscribed Threads Updater
	// that it should re-calculate the time of next update.
	subscribedThreadsUpdater.reset()
}

// Clean up expired threads a month after they've expired.
const CLEAN_UP_EXPIRED_THREADS_AFTER = 30 * 24 * 60 * 60 * 1000

/**
 * Sorts subscribed threads.
 * Removes old expired subscribed threads.
 */
function sortAndCleanUpExpiredSubscribedThreads({ userData, timer }) {
	const subscribedThreads = userData.getSubscribedThreads()
		.filter(({ expiredAt }) => expiredAt ? (timer.now() - expiredAt.getTime() < CLEAN_UP_EXPIRED_THREADS_AFTER) : true)
	sortSubscribedThreads(subscribedThreads, { userData })
	// Doesn't update the subscribed threads "index" collection,
	// but that "index" collection has already cleared itself on thread expiration,
	// so the "index" collection stays consistent with the data collection.
	userData.setSubscribedThreads(subscribedThreads)
}