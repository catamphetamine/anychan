import Storage from './utility/storage/Storage.js'
import CachedStorage from './utility/storage/CachedStorage.js'
import getStoragePrefix from './utility/storage/getStoragePrefix.js'
import UserData from './UserData/UserData.js'

export default function createUserData({
	dataSource,
	multiDataSource,
	userSettings,
	dispatch,
	userDataCleaner
}) {
	let userData
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
			merge: (key, prevValue, newValue) => {
				return userData.mergeKeyData(key, prevValue, newValue)
			}
		})
	}

	userData = new UserData(storage, {
		prefix: getStoragePrefix({
			dataSource,
			multiDataSource
		}),
		userDataCleaner
	})

	return userData
}