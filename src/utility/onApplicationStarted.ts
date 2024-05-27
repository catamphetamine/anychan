import type { UserData, UserSettings, DataSource } from '@/types'
import type { Dispatch } from 'redux'

import UserDataCleaner from '../UserData/UserDataCleaner.js'
import { setUserDataCleaner, setSubscribedThreadsUpdater } from './globals.js'
import getSettings from './settings/getSettings.js'
import SubscribedThreadsUpdater from './SubscribedThreadsUpdater/SubscribedThreadsUpdater.js'
import getMessages from '../messages/getMessages.js'
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
	userSettings,
	dataSource
}: {
	dispatch: Dispatch,
	setInitialized: (isInitialized: boolean) => void,
	userData: UserData,
	userDataForUserDataCleaner: UserData,
	userSettings: UserSettings,
	dataSource: DataSource
}) {
	// Create User Data cleaner.
	const userDataCleaner = new UserDataCleaner({
		dispatch,
		userData: userDataForUserDataCleaner,
		userSettings
	})

	setUserDataCleaner(userDataCleaner)

	// Start User Data cleaner.
	userDataCleaner.start()

	// Start subscribed thread updater.
	const subscribedThreadsUpdater = new SubscribedThreadsUpdater({
		dispatch,
		userData,
		userSettings,
		dataSource,
		createGetThreadParameters() {
			const {
				censoredWords,
				grammarCorrection,
				locale
			} = getSettings({ userSettings })
			return {
				censoredWords,
				grammarCorrection,
				locale,
				messages: getMessages(locale)
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

	return () => {
		userDataCleaner.stop()
		subscribedThreadsUpdater.stop()
	}
}