import Storage from './utility/storage/Storage.js'
import getStoragePrefix from './utility/storage/getStoragePrefix.js'
import UserSettings from './utility/settings/UserSettings.js'
import { getDefaultLanguage } from './utility/settings/settingsDefaults.ts'

export default function createUserSettings({
	dataSource,
	multiDataSource
}) {
	let userSettings

	const storage = new Storage()

	userSettings = new UserSettings(storage, {
		prefix: getStoragePrefix({
			dataSource,
			multiDataSource
		})
	})

	return userSettings
}