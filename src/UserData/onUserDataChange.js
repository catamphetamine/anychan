import { getTrackedThreads } from '../redux/threadTracker'
import { getFavoriteBoards } from '../redux/favoriteBoards'
import UserData from './UserData'

export default function onUserDataChange(key, dispatch) {
	// Update tracked threads list in the UI.
	if (!key || key === UserData.prefix + 'favoriteBoards') {
		dispatch(getFavoriteBoards())
	}
	if (!key || key === UserData.prefix + 'trackedThreadsList') {
		dispatch(getTrackedThreads())
	}
}