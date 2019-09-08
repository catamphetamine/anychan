import { getTrackedThreads } from '../redux/threadTracker'

export default function onUserDataChange(dispatch) {
	// Update tracked threads list in the UI.
	dispatch(getTrackedThreads())
}