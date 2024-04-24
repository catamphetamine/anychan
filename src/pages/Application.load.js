import { setSettingsFromCustomSettingsData } from '../redux/settings.js'
import { getFavoriteChannels } from '../redux/favoriteChannels.js'
import { getSubscribedThreads } from '../redux/subscribedThreads.js'

import { startPollingAnnouncement } from '../utility/announcement.js'
import getBasePath, { addBasePath } from '../utility/getBasePath.js'
import setInitialAuthState from '../utility/auth/setInitialAuthState.js'
import migrateStoredData from '../utility/migrateStoredData.js'
import applySettings from '../utility/settings/applySettings.js'

import { setOfflineMode, setDataSourceInfoForMeta } from '../redux/app.js'
import { getChannels } from '../redux/data.js'
import { setAnnouncement } from '../redux/announcement.js'

import getConfiguration from '../getConfiguration.ts'

export default async function loadApplication({
	dispatch,
	location,
	userData,
	userDataForUserDataCleaner,
	userSettings,
	dataSource,
	dataSourceAlias,
	multiDataSource,
	messages
}) {
	try {
		// This Data Source info is used in the Application's `<meta/>` tags.
		dispatch(setDataSourceInfoForMeta({
			title: dataSource.title,
			description: dataSource.description,
			icon: dataSource.icon,
			language: dataSource.language
		}))

		// Migrate:
		// * Application's "system" data
		// * User Data
		// * User Settings
		await migrateStoredData({
			dispatch,
			userData,
			userSettings
		})

		// Read the user's authentication info from `userData`.
		setInitialAuthState({
			dispatch,
			dataSource,
			userData
		})

		// Apply user's preferences.
		dispatch(getFavoriteChannels({ userData }))
		dispatch(getSubscribedThreads({ userData }))

		// Apply user's settings.
		dispatch(setSettingsFromCustomSettingsData({ settings: userSettings.get() }))
		applySettings({
			dispatch,
			userSettings
		})

		// The `props` for the `<Application/>` component.
		const props = {
			userData,
			userDataForUserDataCleaner,
			userSettings,
			dataSource,
			dataSourceAlias,
			multiDataSource
		}

		// Detect "offline" mode, if was redirected to an error page.
		if (location.query.offline) {
			dispatch(setOfflineMode(true))
			return { props }
		}

		// Get the list of channels.
		await dispatch(getChannels({
			userSettings,
			dataSource,
			multiDataSource,
			messages
		}))

		// Show announcements.
		if (process.env.NODE_ENV === 'production') {
			startPollingAnnouncement(
				getConfiguration().announcementUrl || addBasePath('/announcement.json'),
				announcement => dispatch(setAnnouncement(announcement)),
				getConfiguration().announcementPollInterval,
				{ userData }
			)
		}

		return { props }
	} catch (error) {
		await onError(error, {
			dataSource,
			dataSourceAlias,
			location
		})
	}
}

async function onError(error, {
	dataSource,
	dataSourceAlias,
	location
}) {
	// Log the error.
	console.error(error)

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

	// One could uncomment this `if` to debug an error in development:
	// if (process.env.NODE_ENV === 'production') {
		const basePath = getBasePath({
			dataSource,
			dataSourceAlias
		})

		// Redirect to the error page.
		window.location = `${basePath}${errorPageUrl}?offline=✓&url=${encodeURIComponent(basePath + location.pathname + location.search + location.hash)}`

		// Assigning a new URL via `window.location = ` doesn't stop the code flow
		// and the rest of the code gets executed anyway.
		//
		// https://stackoverflow.com/questions/2536793/does-changing-window-location-stop-execution-of-javascript
		//
		// To work around that, `await new Promise(resolve => {})` code was added:
		// that code line doesn't ever "finish", effectively stopping the execution
		// of the code on this page.
		//
		// Why does the execution of the code have to be stopped here:
		// otherwise, the app would assume that the list of channels is available
		// so it would attempt to access it and then it would throw an error.
		//
		await new Promise(resolve => {})
	// }

	// One could uncomment this to debug an error in development:
	// alert('Error in `Application.load.js`. See the console for more details.')
	// throw error
}