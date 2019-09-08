import { getTrackedThreads } from '../redux/threadTracker'
import { getFavoriteBoards } from '../redux/favoriteBoards'

export default function onUserDataChange(dispatch) {
	// Update tracked threads list in the UI.
	dispatch(getTrackedThreads())
	dispatch(getFavoriteBoards())
}