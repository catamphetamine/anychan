import { getTrackedThreads } from '../redux/threadTracker'
import { getFavoriteBoards } from '../redux/favoriteBoards'
import UserData from './UserData'

export default function onUserDataChange(key, dispatch) {
	// Update favorite boards list in Sidebar.
	if (!key || key === UserData.prefix + 'favoriteBoards') {
		dispatch(getFavoriteBoards())
	}
	if (!key ||
		// Update tracked threads list in Sidebar.
		key === UserData.prefix + 'trackedThreadsList' ||
		// When "latest read comments" change,
		// this could potentially lead to some watched thread's
		// new comments counters to change,
		// so update tracked threads list in Sidebar.
		key === UserData.prefix + 'latestReadComments') {
		dispatch(getTrackedThreads())
	}
}