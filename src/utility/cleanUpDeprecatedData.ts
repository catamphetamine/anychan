import type { DataSource } from '@/types'

import getStoragePrefix from '../utility/storage/getStoragePrefix.js'

export default function cleanUpDeprecatedData({
	dataSource,
	multiDataSource
}: {
	dataSource: DataSource,
	multiDataSource: boolean
}) {
	const legacyLocalStorageKeys = [
		getStoragePrefix({ dataSource, multiDataSource }) + 'getChannels',
		getStoragePrefix({ dataSource, multiDataSource }) + 'getAllChannels'
	]

	for (const legacyKey of legacyLocalStorageKeys) {
		if (localStorage.getItem(legacyKey)) {
			localStorage.removeItem(legacyKey)
		}
	}
}