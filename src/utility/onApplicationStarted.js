import UserDataCleaner from '../UserData/UserDataCleaner.js'
import { setUserDataCleaner, setSubscribedThreadsUpdater } from './globals.js'
import getSettings from './settings/getSettings.js'
import SubscribedThreadsUpdater from './SubscribedThreadsUpdater/SubscribedThreadsUpdater.js'

import { getFavoriteChannels } from '../redux/favoriteChannels.js'
import { getSubscribedThreads } from '../redux/subscribedThreads.js'
import { setAnnouncement } from '../redux/announcement.js'
import { setCookiesAccepted } from '../redux/app.js'

import { areCookiesAccepted } from 'frontend-lib/utility/cookiePolicy.js'

export default function onApplicationStarted({
	dispatch,
	setInitialized,
	userData,
	userDataForUserDataCleaner,
	userSettings
}) {
	// Start User Data cleaner.
	const userDataCleaner = new UserDataCleaner({ userData: userDataForUserDataCleaner })
	setUserDataCleaner(userDataCleaner)

	userDataCleaner.start()

	// Start subscribed thread updater.
	const subscribedThreadsUpdater = new SubscribedThreadsUpdater({
		dispatch,
		userData,
		userSettings,
		createGetThreadParameters() {
			const {
				censoredWords,
				grammarCorrection,
				locale
			} = getSettings({ userSettings })
			return {
				censoredWords,
				grammarCorrection,
				locale
			}
		}
	})

	setSubscribedThreadsUpdater(subscribedThreadsUpdater)

	subscribedThreadsUpdater.start()

	// Initialize announcement.
	dispatch(setAnnouncement(userData.getAnnouncement()))

	// Initialize cookies accepted flag.
	dispatch(setCookiesAccepted(areCookiesAccepted()))

	// Initialize favorite channels.
	dispatch(getFavoriteChannels({ userData }))

	// Initialize subscribed threads.
	dispatch(getSubscribedThreads({ userData }))

	setInitialized(true)
}