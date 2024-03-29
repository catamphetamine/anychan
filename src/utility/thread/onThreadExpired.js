import { onStartExpired } from '../subscribedThread/subscribedThreadRecordStatusUpdaters.js'
import onSubscribedThreadsChanged from '../subscribedThread/onSubscribedThreadsChanged.js'
import { getSubscribedThreads } from '../../redux/subscribedThreads.js'

// A thread is thought to be "expired" when a request for this thread's data
// returns a `404 Not Found` error.
// This means that a thread could also go "expired" accidentally when there's
// an error on the dataSource's website (HTTP server misconfiguration, etc).
// Therefore, it doesn't immediately erase all of the thread's data in User Data.
// Instead, `UserDataCleaner` periodically clears "stale" thread data.
// (data for threads that haven't been accessed for a long time and are
//  either archived or expired).
export default function onThreadExpired(channelId, threadId, { dispatch, userData }) {
	// If this thread is subscribed to, then update its `expired` flag.
	const subscribedThread = userData.getSubscribedThread(channelId, threadId)
	if (subscribedThread && !subscribedThread.expired) {
		onStartExpired(subscribedThread)
		userData.updateSubscribedThread(subscribedThread)
		// Re-render the list of subscribed threads in the sidebar.
		onSubscribedThreadsChanged({ dispatch, userData, sort: true })
	}
}