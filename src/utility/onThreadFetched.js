import updateTrackedThreadInfo from './updateTrackedThreadInfo'
import UserData from '../UserData/UserData'
import { getTrackedThreads } from '../redux/trackedThreads'

export default function onThreadFetched(thread, { dispatch }) {
	// If this thread is tracked, then update its `latestComment`.
	if (updateTrackedThreadInfo(thread, { hasFullThreadInfo: true })) {
		dispatch(getTrackedThreads())
	}
}