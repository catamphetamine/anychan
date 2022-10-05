import CachedStorage from './utility/storage/CachedStorage.js'
import getPrefix from './utility/storage/getStoragePrefix.js'
import UserData from './UserData/UserData.js'

let userData

export default function getUserData() {
	if (!userData) {
		userData = createUserData()
	}
	return userData
}

// `getPrefix()` result depends on the current provider,
// and the current provider is not known beforhand
// and is determined either from the current URL
// or from the configuration file.
// That means that the default `UserData` instance can't be created
// before the current provider has been set, which means that
// the default `UserData` should be created in a later function call
// rather than immediately at the top level of the file.
function createUserData() {
	return new UserData(
		new CachedStorage({
			merge: (key, prevValue, newValue) => {
				return userData.mergeKeyData(key, prevValue, newValue)
			}
		}),
		{
			prefix: getPrefix()
		}
	)
}