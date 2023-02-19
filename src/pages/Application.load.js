import { getSettings } from '../redux/settings.js'
import { getFavoriteChannels } from '../redux/favoriteChannels.js'
import { getSubscribedThreads } from '../redux/subscribedThreads.js'

import { onDispatchReady } from '../utility/dispatch.js'
import { startPollingAnnouncement } from '../utility/announcement.js'
import getBasePath, { addBasePath } from '../utility/getBasePath.js'

import { setOfflineMode } from '../redux/app.js'
import { getChannels } from '../redux/data.js'
import { setAnnouncement } from '../redux/announcement.js'

import configuration from '../configuration.js'

export default async function loadApplication({
	dispatch,
	getState,
	location,
	userData,
	userSettings
}) {
	// Dispatch delayed actions.
	// For example, `dispatch(autoDarkMode())`.
	onDispatchReady(dispatch)

	// Fill in user's preferences.
	dispatch(getSettings({ userSettings }))
	dispatch(getFavoriteChannels({ userData }))
	dispatch(getSubscribedThreads({ userData }))

	// Detect offline mode.
	if (location.query.offline) {
		return dispatch(setOfflineMode(true))
	}

	// Get the list of channels.
	try {
		await dispatch(getChannels({ userSettings }))
	} catch (error) {
		let errorPageUrl
		// `503 Service Unavailable`
		// `502 Bad Gateway`
		// "Request has been terminated" error is thrown by a web browser
		// when it can't connect to the server (doesn't have a `status`).
		if (error.message.indexOf('Request has been terminated') === 0 || error.status === 503 || error.status === 502) {
			errorPageUrl = '/offline'
		} else if (error.status === 404) {
			errorPageUrl = '/not-found'
		} else {
			errorPageUrl = '/error'
		}
		if (errorPageUrl) {
			console.error(error)
			window.location = `${getBasePath()}${errorPageUrl}?offline=✓&url=${encodeURIComponent(getBasePath() + location.pathname + location.search + location.hash)}`
			// Don't render the page because it would throw.
			// (the app assumes the list of channels is available).
			// (maybe javascript won't even execute this line,
			//  because it's after a `window.location` redirect,
			//  or maybe it will, so just in case).
			await new Promise(resolve => {})
		} else {
			throw error
		}
	}

	// Show announcements.
	if (process.env.NODE_ENV === 'production') {
		startPollingAnnouncement(
			configuration.announcementUrl || addBasePath('/announcement.json'),
			announcement => dispatch(setAnnouncement(announcement)),
			configuration.announcementPollInterval,
			{ userData }
		)
	}
}