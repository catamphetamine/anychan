import getChannels from '../getChannels.js'
import getConfiguration from '../../configuration.js'
import getPrefix from '../../utility/storage/getStoragePrefix.js'
import storage from './storage.js'

/**
 * Caches `getChannels()` result for a day.
 * This is to avoid re-fetching `/boards.json` needlessly
 * every time a user opens a page in a new tab.
 * @param {boolean} [all] — The `all` option of `getChannels()`.
 * @return {object} `getChannels()` result.
 */
export default async function getChannelsCached({
	all,
	...rest
}) {
	// See if there's a recent cached value. If there is, return it.
	let result = readFromCache({ all })
	if (result) {
		return result
	}

	// Fetch the list of channels.
	result = await getChannels({
		all,
		...rest
	})

	// Update the cached value.
	writeToCache(result, { all })

	// Return the result.
	return result
}

export function clearChannelsCache() {
	storage.delete(getChannelsCacheKey())
	storage.delete(getAllChannelsCacheKey())
}

export function getChannelsCacheKey() {
	return getPrefix() + 'getChannels'
}

export function getAllChannelsCacheKey() {
	return getPrefix() + 'getAllChannels'
}

function readFromCache({ all }) {
	const cached = storage.get(getCacheKey({ all }))
	if (cached && cached.timestamp + getConfiguration().channelsCacheTimeout >= Date.now()) {
		return cached.value
	}
}

function writeToCache(result, { all }) {
	storage.set(getCacheKey({ all }), {
		timestamp: Date.now(),
		value: result
	})
}

function getCacheKey({ all }) {
	return all ? getAllChannelsCacheKey() : getChannelsCacheKey()
}