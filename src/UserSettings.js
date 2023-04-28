import storage, { setLocaleSource } from './utility/storage/storage.js'
import getPrefix from './utility/storage/getStoragePrefix.js'
import UserSettings from './utility/settings/UserSettings.js'

let userSettings

export default function getUserSettings() {
	if (!userSettings) {
		userSettings = createUserSettings()
	}
	return userSettings
}

// `getPrefix()` result depends on the current dataSource,
// and the current data source is not known beforhand
// and is determined either from the current URL
// or from the configuration file.
// That means that the default `UserSettings` instance can't be created
// before the current data source has been set, which means that
// the default `UserSettings` should be created in a later function call
// rather than immediately at the top level of the file.
function createUserSettings() {
	const userSettings = new UserSettings(storage, {
		prefix: getPrefix()
	})

	// Set current locale for getting translated messages.
	setLocaleSource(() => userSettings.get('locale'))

	return userSettings
}