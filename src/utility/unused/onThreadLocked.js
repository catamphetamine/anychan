import UserData from '../UserData/UserData'
import { onStartLocked } from './updateSubscribedThreadRecord'
import { getSubscribedThreads } from '../redux/subscribedThreads'

export default function onThreadLocked(thread, { dispatch, userData = UserData }) {
	// If this thread is subscribed to, then update its `locked` flag.
	const subscribedThread = userData.getSubscribedThread(thread.channelId, thread.id)
	if (subscribedThread && !subscribedThread.locked) {
		onStartLocked(subscribedThread)
		userData.setSubscribedThread(subscribedThread)
		// Re-render the list of subscribed threads in the sidebar.
		dispatch(getSubscribedThreads({ userData }))
	}
}