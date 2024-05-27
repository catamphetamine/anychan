import type { Thread, UserData } from '@/types'
import type { Dispatch } from 'redux'

import { Timer } from 'web-browser-timer'

import onSubscribedThreadFetched from '../subscribedThread/onSubscribedThreadFetched.js'
import onSubscribedThreadsChanged from '../subscribedThread/onSubscribedThreadsChanged.js'

export default function onThreadFetched(thread: Thread, {
	dispatch,
	userData,
	timer = new Timer()
}: {
	dispatch: Dispatch,
	userData: UserData,
	timer?: Timer
}) {
	// Update "latest accessed at" timestamp of the thread.
	userData.setThreadAccessedAt(thread.channelId, thread.id, new Date(timer.now()))

	// If this thread is subscribed to, then update its stats.
	if (userData.getSubscribedThread(thread.channelId, thread.id)) {
		// If there're any changes to the subscribed thread data since the last time.
		if (onSubscribedThreadFetched(thread, { userData, timer })) {
			// Re-render the list of subscribed threads.
			onSubscribedThreadsChanged({ dispatch, userData, sort: true })
		}
	}
}