import { Timer } from 'web-browser-timer'

import onSubscribedThreadFetched from '../subscribedThread/onSubscribedThreadFetched.js'
import onSubscribedThreadsChanged from '../subscribedThread/onSubscribedThreadsChanged.js'

import { getSubscribedThreads } from '../../redux/subscribedThreads.js'

export default function onThreadFetched(thread, {
	dispatch,
	userData,
	timer = new Timer()
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