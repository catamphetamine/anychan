import type { DataSource, UserSettings } from '@/types'
import type { Dispatch } from 'redux'

import createUserData from '../createUserData.js'
import addUserDataExternalChangeListener from '../UserData/addUserDataExternalChangeListener.js'

export default function createAndInitUserData({
	dataSource,
	multiDataSource,
	userSettings,
	dispatch
}: {
	dataSource: DataSource,
	multiDataSource: boolean,
	userSettings: UserSettings,
	dispatch: Dispatch
}) {
	const userData = createUserData({
		dataSource,
		multiDataSource,
		userSettings,
		dispatch
	})

	const userDataForUserDataCleaner = createUserData({
		dataSource,
		multiDataSource,
		userSettings,
		dispatch,
		userDataCleaner: true
	})

	// Listen to `userData` changes coming from other browser tabs.
	// This listener should be added right after the `UserData`
	// has initially been read from the `localStorage`.
	addUserDataExternalChangeListener({
		dispatch,
		userData
	})

	// `UserData` uses `CachedStorage` to reduce the rate of writing to disk.
	// Calling `start()` on `UserData` tells `CachedStorage` to start listening
	// to external changes to `localStorage` in order to update its internal cache
	// on any writes from other windows or tabs.
	userData.start()

	return {
		userData,
		userDataForUserDataCleaner
	}
}