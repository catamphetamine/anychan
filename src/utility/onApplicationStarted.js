import getUserData from '../UserData.js'
import UserDataCleaner from '../UserData/UserDataCleaner.js'
import { setUserDataCleaner, setSubscribedThreadsUpdater } from './globals.js'
import getSettings from './settings/getSettings.js'
import SubscribedThreadsUpdater from './SubscribedThreadsUpdater/SubscribedThreadsUpdater.js'

import { getFavoriteChannels } from '../redux/favoriteChannels.js'
import { getSubscribedThreads } from '../redux/subscribedThreads.js'
import { setAnnouncement } from '../redux/announcement.js'
import { setCookiesAccepted } from '../redux/app.js'

import { areCookiesAccepted } from 'frontend-lib/utility/cookiePolicy.js'

export default function onApplicationStarted({ dispatch, setInitialized }) {
	// Start User Data cleaner.
	const userDataCleaner = new UserDataCleaner()
	setUserDataCleaner(userDataCleaner)

	userDataCleaner.start()

	// Start subscribed thread updater.
	const subscribedThreadsUpdater = new SubscribedThreadsUpdater({
		dispatch,
		createGetThreadParameters() {
			const {
				censoredWords,
				grammarCorrection,
				locale
			} = getSettings()
			return {
				censoredWords,
				grammarCorrection,
				locale
			}
		}
	})

	setSubscribedThreadsUpdater(subscribedThreadsUpdater)

	subscribedThreadsUpdater.start()

	const userData = getUserData()

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