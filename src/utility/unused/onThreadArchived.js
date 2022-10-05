import UserData from '../UserData/UserData'
import { onStartArchived } from './updateSubscribedThreadRecord'
import { getSubscribedThreads } from '../redux/subscribedThreads'

export default function onThreadArchived(thread, { dispatch, userData = UserData }) {
	// If this thread is subscribed to, then update its `archived` flag.
	const subscribedThread = userData.getSubscribedThread(thread.channelId, thread.id)
	if (subscribedThread && !subscribedThread.archived) {
		onStartArchived(subscribedThread)
		userData.setSubscribedThread(subscribedThread)
		// Re-render the list of subscribed threads in the sidebar.
		dispatch(getSubscribedThreads({ userData }))
	}
}