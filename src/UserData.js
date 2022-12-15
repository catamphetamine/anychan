import CachedStorage from './utility/storage/CachedStorage.js'
import getPrefix from './utility/storage/getStoragePrefix.js'
import UserData from './UserData/UserData.js'

let userData
let userDataForUserDataCleaner

export default function getUserData({ userDataCleaner } = {}) {
	if (userDataCleaner) {
		if (!userDataForUserDataCleaner) {
			userDataForUserDataCleaner = createUserData({ userDataCleaner })
		}
		return userDataForUserDataCleaner
	} else {
		if (!userData) {
			userData = createUserData()
		}
		return userData
	}
}

// `getPrefix()` result depends on the current provider,
// and the current provider is not known beforhand
// and is determined either from the current URL
// or from the configuration file.
// That means that the default `UserData` instance can't be created
// before the current provider has been set, which means that
// the default `UserData` should be created in a later function call
// rather than immediately at the top level of the file.
function createUserData({ userDataCleaner } = {}) {
	return new UserData(
		new CachedStorage({
			merge: (key, prevValue, newValue) => {
				return userData.mergeKeyData(key, prevValue, newValue)
			}
		}),
		{
			prefix: getPrefix(),
			userDataCleaner
		}
	)
}