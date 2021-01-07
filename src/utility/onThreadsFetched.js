import updateTrackedThreadInfo from './updateTrackedThreadInfo'
import UserData, { TRACKED_THREADS_INDEX_COLLECTION_NAME } from '../UserData/UserData'
import { getTrackedThreads } from '../redux/trackedThreads'

export default function onThreadsFetched(channelId, threads, { dispatch }) {
	// Clear expired threads from user data.
	const updatedCollections = UserData.clearExpiredThreads(channelId, threads)
	let trackedThreadsChanged = updatedCollections.includes(TRACKED_THREADS_INDEX_COLLECTION_NAME)
	// For each tracked thread, update its `latestComment` info.
	for (const thread of threads) {
		if (updateTrackedThreadInfo(thread)) {
			trackedThreadsChanged = true
		}
	}
	if (trackedThreadsChanged) {
		dispatch(getTrackedThreads())
	}
}