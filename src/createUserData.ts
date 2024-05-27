import type { UserData as UserDataType, UserSettings, DataSource } from '@/types'
import type UserDataCleaner from './UserData/UserDataCleaner.js'
import type { Dispatch } from 'redux'

import Storage from './utility/storage/Storage.js'
import CachedStorage from './utility/storage/CachedStorage.js'
import getStoragePrefix from './utility/storage/getStoragePrefix.js'
import UserData from './UserData/UserData.js'

interface Parameters {
	dataSource: DataSource;
	multiDataSource: boolean;
	userSettings: UserSettings;
	dispatch: Dispatch;
	// `userDataCleaner` is not yet created at the time of creating a `UserData` instance.
	// That's why it's passed as a `boolean` rather than a `UserDataCleaner` instance.
	userDataCleaner?: boolean;
}

export default function createUserData({
	dataSource,
	multiDataSource,
	userSettings,
	dispatch,
	userDataCleaner
}: Parameters): UserDataType {
	let userData: UserData
	let storage

	const storageOptions = {
		dispatch,
		getLocale: () => userSettings.get('locale')
	}

	// `UserData` uses `CachedStorage` to minimize writing to disk.
	// Suppose a user rapidly scrolls through a thread with ~1000 comments.
	// It would result in the same amount of writes to the "latest read comment ID"
	// value in `UserData`. In order to prevent those needless excessive write operations
	// to be dispatched, `CachedStorage` caches those writes and only dispatches the final one
	// after some time passes, or when the user switches to a different tab, etc.
	//
	// For User Data Cleaner though, there doesn't seem to be a need for such caching.
	// That's because data in `localStorage` is spread across separate cells anyway,
	// each cell being named after the corresponding thread ID and the data type,
	// so User Data Cleaner doesn't end up writing several times to a single cell.
	// So User Data Cleaner uses a usual storage, not a "cached" one.
	//
	if (userDataCleaner) {
		storage = new Storage(storageOptions)
	} else {
		storage = new CachedStorage({
			...storageOptions,
			merge: (key: string, prevValue: any, newValue: any) => {
				return userData.mergeKeyData(key, prevValue, newValue)
			}
		})
	}

	// `userData` is used in the `storage` above.
	userData = new UserData(storage, {
		prefix: getStoragePrefix({
			dataSource,
			multiDataSource
		}),
		userDataCleaner
	})

	return userData as unknown as UserDataType
}