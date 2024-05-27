import type { DataSource } from '@/types'

import Storage from './utility/storage/Storage.js'
import getStoragePrefix from './utility/storage/getStoragePrefix.js'
import UserSettings from './utility/settings/UserSettings.js'

export default function createUserSettings({
	dataSource,
	multiDataSource
}: {
	dataSource: DataSource,
	multiDataSource: boolean
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