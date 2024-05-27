import type { Channel, Thread, UserData } from '@/types'

import { Timer } from 'web-browser-timer'

import reportError from '../reportError.js'

import { createSubscribedThreadStateRecordStub } from './createSubscribedThreadStateRecord.js'

/**
 * Updates subscribed thread info with the date of the error event.
 * This is used in `SubscribedThreadsUpdater.js` to wait until refreshing such thread.
 * @param  {object} parameters
 * @param  {string} parameters.channelId
 * @param  {number} parameters.threadId
 * @return {boolean} [updated] Returns true if the subscribed thread record was updated.
 */
export default function onSubscribedThreadFetchError({
	channelId,
	threadId
}: {
	channelId: Channel['id'],
	threadId: Thread['id']
}, {
	userData,
	timer = new Timer()
}: {
	userData: UserData,
	timer?: Timer
}) {
	const subscribedThread = userData.getSubscribedThread(channelId, threadId)

	// Check that the subscribed thread record exists.
	// It is possible that it wouldn't exist in the following case:
	// * `SubscribedThreadUpdater` starts
	// * `SubscribedThreadUpdater` collects a list of threads to refresh
	// * `SubscribedThreadUpdater` refreshes a thread
	// * `SubscribedThreadUpdater` waits before proceeding with another thread
	// * `UserDataCleaner` starts
	// * `UserDataCleaner` ends and removes an obsolete subscribed thread
	// * `SubscribedThreadUpdater` finishes waiting and proceeds with the rest of the threads in the list
	// * `SubscribedThreadUpdater` encounters a thread in the list that was removed by `UserDataCleaner`
	if (!subscribedThread) {
		console.warn(`Subscribed thread record for /${channelId}/${threadId} was not found`)
		return
	}

	let prevStats = userData.getSubscribedThreadState(channelId, threadId)

	if (!prevStats) {
		console.error(`"subscribedThreadsState" record not found for subscribed thread record "/${channelId}/${threadId}"`)
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