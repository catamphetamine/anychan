import type { DataSource, UserSettings, Locale } from '@/types'

import getChannels from '../getChannels.js'
import getConfiguration from '../../getConfiguration.js'
import getStoragePrefix from '../../utility/storage/getStoragePrefix.js'
import Storage from '../../utility/storage/Storage.js'

const storage = new Storage()

interface Parameters {
	all?: boolean;
	locale: Locale;
	originalDomain?: string;
	multiDataSource?: boolean;
	forceRefresh?: boolean;
	dataSource: DataSource;
	userSettings: UserSettings;
}

/**
 * Caches `getChannels()` result for a day.
 * This is to avoid re-fetching `/boards.json` needlessly
 * every time a user opens a page in a new tab.
 */
export default async function getChannelsCached(parameters: Parameters): ReturnType<typeof getChannels> {
	const {
		all,
		dataSource,
		multiDataSource,
		forceRefresh
	} = parameters

	if (dataSource === undefined) {
		throw new Error('A cached version of `getChannels()` expects a `dataSource` parameter')
	}

	if (multiDataSource === undefined) {
		throw new Error('A cached version of `getChannels()` expects a `multiDataSource` parameter')
	}

	// See if there's a recent cached value. If there is, return it.
	let result
	if (!forceRefresh) {
		result = readFromCache({ all, dataSource, multiDataSource })
	}

	if (result) {
		return result
	}

	// Fetch the list of channels.
	result = await getChannels(parameters)

	// Update the cached value.
	writeToCache(result, { all, dataSource, multiDataSource })

	// Return the result.
	return result
}

export function clearChannelsCache({
	dataSource,
	multiDataSource
}: {
	dataSource: DataSource,
	multiDataSource: boolean
}) {
	storage.delete(getChannelsCacheKey({ dataSource, multiDataSource }))
	storage.delete(getAllChannelsCacheKey({ dataSource, multiDataSource }))
}

export function getChannelsCacheKey({
	dataSource,
	multiDataSource
}: {
	dataSource: DataSource,
	multiDataSource: boolean
}) {
	return getStoragePrefix({ dataSource, multiDataSource }) + 'getChannels'
}

export function getAllChannelsCacheKey({
	dataSource,
	multiDataSource
}: {
	dataSource: DataSource,
	multiDataSource: boolean
}) {
	return getStoragePrefix({ dataSource, multiDataSource }) + 'getAllChannels'
}

function readFromCache({ all, dataSource, multiDataSource }: {
	all: boolean,
	dataSource: DataSource,
	multiDataSource: boolean
}): Awaited<ReturnType<typeof getChannels>> {
	const cached = storage.get(getCacheKey({ all, dataSource, multiDataSource }))
	if (cached && cached.timestamp + getConfiguration().channelsCacheTimeout >= Date.now()) {
		return cached.value
	}
}

function writeToCache(result: Awaited<ReturnType<typeof getChannels>>, { all, dataSource, multiDataSource }: {
	all: boolean,
	dataSource: DataSource,
	multiDataSource: boolean
}) {
	storage.set(getCacheKey({ all, dataSource, multiDataSource }), {
		timestamp: Date.now(),
		value: result
	})
}

function getCacheKey({ all, dataSource, multiDataSource }: {
	all: boolean,
	dataSource: DataSource,
	multiDataSource: boolean
}) {
	return all ? getAllChannelsCacheKey({
		dataSource,
		multiDataSource
	}) : getChannelsCacheKey({
		dataSource,
		multiDataSource
	})
}