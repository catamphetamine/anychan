import { Timer } from 'web-browser-timer'

import reportError from '../reportError.js'

import { createSubscribedThreadStateRecordStub } from './createSubscribedThreadStateRecord.js'

/**
 * Updates subscribed thread info with the date of the error event.
 * This is used in `SubscribedThreadsUpdater.js` to wait until refreshing such thread.
 * @param  {string} Channel ID
 * @param  {number} Thread ID
 * @return {boolean} [updated] Returns true if the subscribed thread record was updated.
 */
export default function onSubscribedThreadFetchError({
	channelId,
	threadId
}, {
	userData,
	timer = new Timer()
} = {}) {
	const subscribedThread = userData.getSubscribedThread(channelId, threadId)

	// Check that the subscribed thread record exists,
	// if "is subscribed thread" detection was done by some other means.
	if (!subscribedThread) {
		// Shouldn't happen. But just in case it happens for whatever weird reason.
		return reportError(new Error(`Subscribed thread record for /${channelId}/${threadId} thread was not found`))
	}

	let prevStats = userData.getSubscribedThreadState(channelId, threadId)

	if (!prevStats) {
		console.error(`"subscribedThreadsState" record not found for subscribed thread "/${channelId}/${threadId}"`)
		prevStats = createSubscribedThreadStateRecordStub(subscribedThread)
	}

	prevStats.refreshErrorAt = new Date(timer.now())
	prevStats.refreshErrorCount = (prevStats.refreshErrorCount || 0) + 1

	userData.setSubscribedThreadState(
		channelId,
		threadId,
		prevStats
	)
}