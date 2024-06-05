import type { DataSource } from '@/types'

import getConfiguration from '../../getConfiguration.js'
import getStoragePrefix from '../../utility/storage/getStoragePrefix.js'
import Storage from '../../utility/storage/Storage.js'

const storage = new Storage()

type CacheId = 'channels' | 'topChannels'

export async function get<Result = any>(
	id: CacheId,
	get: () => Promise<Result>,
	dataSource: DataSource,
	multiDataSource: boolean,
	forceRefresh?: boolean
): Promise<Result> {
	// See if there's a recent cached value. If there is, return it.
	let result: Result
	if (!forceRefresh) {
		result = readFromCache({ id, dataSource, multiDataSource })
	}

	if (result) {
		return result
	}

	// Fetch the list of channels.
	result = await get()

	// Update the cached value.
	writeToCache(result, { id, dataSource, multiDataSource })

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
	storage.delete(getTopChannelsCacheKey({ dataSource, multiDataSource }))
	storage.delete(getChannelsCacheKey({ dataSource, multiDataSource }))
}

function getTopChannelsCacheKey({
	dataSource,
	multiDataSource
}: {
	dataSource: DataSource,
	multiDataSource: boolean
}) {
	return getStoragePrefix({ dataSource, multiDataSource }) + 'api/getTopChannels'
}

function getChannelsCacheKey({
	dataSource,
	multiDataSource
}: {
	dataSource: DataSource,
	multiDataSource: boolean
}) {
	return getStoragePrefix({ dataSource, multiDataSource }) + 'api/getChannels'
}

export function readFromCache<Result>({
	id,
	dataSource,
	multiDataSource
}: {
	id: CacheId,
	dataSource: DataSource,
	multiDataSource: boolean
}): Result {
	const cached = storage.get(getCacheKey({ id, dataSource, multiDataSource }))
	if (cached && cached.timestamp + getConfiguration().channelsCacheTimeout >= Date.now()) {
		return cached.value
	}
}

function writeToCache<Result>(result: Result, {
	id,
	dataSource,
	multiDataSource
}: {
	id: CacheId,
	dataSource: DataSource,
	multiDataSource: boolean
}) {
	storage.set(getCacheKey({ id, dataSource, multiDataSource }), {
		timestamp: Date.now(),
		value: result
	})
}

function getCacheKey({
	id,
	dataSource,
	multiDataSource
}: {
	id: CacheId
	dataSource: DataSource,
	multiDataSource: boolean
}) {
	switch (id) {
		case 'channels':
			return getChannelsCacheKey({
				dataSource,
				multiDataSource
			})
		case 'topChannels':
			return getTopChannelsCacheKey({
				dataSource,
				multiDataSource
			})
	}
}