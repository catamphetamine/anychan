import { getTrackedThreads } from '../redux/trackedThreads'
import { getFavoriteChannels } from '../redux/favoriteChannels'
import { setAnnouncement } from '../redux/announcement'

import UserData from './UserData'

// This function is called whenever "user data" changes
// in `localStorage` in some other tab (that is detected
// via a `localStorage` listener), or this function is also
// called manually when changing "user data" in the current tab.
export default function onUserDataChange(key, dispatch) {
	// Update favorite channels list in Sidebar.
	if (!key || key === UserData.prefix + 'favoriteChannels') {
		dispatch(getFavoriteChannels())
	}
	if (!key ||
		// If tracked threads data was updated.
		key === UserData.prefix + 'trackedThreadsList' ||
		// If "latest read comments" were updated.
		// When "latest read comments" change,
		// this could potentially lead to some watched thread's
		// new comments counters to change,
		// so update tracked threads list in Sidebar.
		key === UserData.prefix + 'latestReadComments') {
		// Update tracked threads list in Sidebar.
		// This updates their "new comments" counters.
		dispatch(getTrackedThreads())
	}
	if (!key ||
		key === UserData.prefix + 'announcement') {
		dispatch(setAnnouncement(UserData.getAnnouncement()))
	}
}