import { onCommentRead } from '../redux/data.js'
import { getSubscribedThreads } from '../redux/subscribedThreads.js'
import { getFavoriteChannels } from '../redux/favoriteChannels.js'
import { setAnnouncement } from '../redux/announcement.js'

import { getSubscribedThreadsUpdater } from '../utility/globals.js'

import {
	favoriteChannels,
	subscribedThreads,
	subscribedThreadsIndex,
	subscribedThreadsState,
	latestReadComments,
	announcement
} from './collections/index.js'

// This function is called whenever "user data" changes
// in `localStorage` in some other tab (that is detected
// via a `localStorage` listener), or this function is also
// called manually when changing "user data" in the current tab.
export default function onUserDataExternalChange({
	collection,
	metadata: {
		channelId,
		threadId
	},
	value,
	dispatch,
	userData
}) {
	if (collection === favoriteChannels) {
		// Update favorite channels list in Sidebar.
		dispatch(getFavoriteChannels({ userData }))
	}

	if (
		// If subscribed threads data was updated.
		collection === subscribedThreads ||
		collection === subscribedThreadsIndex ||
		collection === subscribedThreadsState
	) {
		// Update the subscribed threads list in the sidebar.
		dispatch(getSubscribedThreads({ userData }))

		// Notify Subscribed Threads Updater
		// that it should re-calculate the time of next update.
		//
		// `subscribedThreadsUpdater` global variable is not set in tests.
		//
		if (getSubscribedThreadsUpdater()) {
			getSubscribedThreadsUpdater().reset()
		}
	}

	if (collection === latestReadComments) {
		// If some of the "new" comments have been read,
		// unmark them as "unread" on the current page
		// if the current page is a thread page.
		dispatch(onCommentRead({
			channelId,
			threadId,
			commentId: value,
			// `onCommentRead()` allows passing `commentIndex: undefined`.
			commentIndex: undefined
		}))
		// Or, could re-calculate thread auto-update state from scratch.
		// dispatch(refreshAutoUpdateNewCommentsState())
	}

	if (collection === announcement) {
		// If announcement was updated, show it.
		dispatch(setAnnouncement(userData.getAnnouncement()))
	}

	// Could also handle changes to:
	// * `hiddenThreads`
	// * `hiddenComments`
	// * `hiddenAuthors`
	//
	// Those changes would result in re-rendering `.hidden` property:
	// * On thread comments on a thread page
	// * On thread cards on a catalog page
	//
	// If some comment or thread gets hidden then it should also call
	// `onHeightChange()` for those comments so that there's no "jump of content"
	// in the `virtual-scroller` when the user scrolls up.

	// Could also handle changes to:
	// * `ownThreads`
	// * `ownComments`
	//
	// Those changes would result in re-rendering `.own` property:
	// * On thread comments on a thread page
	// * On thread cards on a catalog page
}