import { Timer } from 'web-browser-timer'

import getUserData from '../../UserData.js'
import onSubscribedThreadFetched from '../subscribedThread/onSubscribedThreadFetched.js'
import { getSubscribedThreads } from '../../redux/subscribedThreads.js'

export default function onThreadFetched(thread, {
	dispatch,
	userData = getUserData(),
	timer = new Timer()
}) {
	// Update "latest accessed at" timestamp of the thread.
	userData.setThreadAccessedAt(thread.channelId, thread.id, new Date(timer.now()))

	// If this thread is subscribed to, then update its stats.
	if (userData.getSubscribedThread(thread.channelId, thread.id)) {
		if (onSubscribedThreadFetched(thread, { userData, timer })) {
			dispatch(getSubscribedThreads({ userData }))
		}
	}
}