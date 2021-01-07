import UserData from '../UserData/UserData'
import { getTrackedThreads } from '../redux/trackedThreads'

export default function onThreadExpired(channelId, threadId, { dispatch }) {
	const isTrackedThread = UserData.isTrackedThread(channelId, threadId)
	UserData.onThreadExpired(channelId, threadId)
	if (isTrackedThread) {
		dispatch(getTrackedThreads())
	}
}