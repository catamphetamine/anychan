import getChannels from '../getChannels'
import { getPrefix } from '../../utility/localStorage'
import configuration from '../../configuration'

import LocalStorage from 'webapp-frontend/src/utility/storage/LocalStorage'

const storage = new LocalStorage()

/**
 * Caches `getChannels()` result for a day.
 * This is to avoid re-fetching `/boards.json` needlessly
 * every time a user opens a page in a new tab.
 * @param {boolean} [all] — The `all` option of `getChannels()`.
 * @param {object} http — `react-pages` `http` utility.
 * @return {object} `getChannels()` result.
 */
export default async function getChannelsCached({
	all,
	http
}) {
	const prefix = getPrefix()
	const key = prefix + (all ? 'getAllChannels' : 'getChannels')
	const cached = storage.get(key)
	if (cached && cached.timestamp + configuration.channelsCacheTimeout >= Date.now()) {
		return cached.value
	}
	// Fetch the list of channels and cache it with the current timestamp.
	const result = await getChannels({
		all,
		http
	})
	storage.set(key, {
		timestamp: Date.now(),
		value: result
	})
	return result
}

export function clearChannelsCache() {
	const prefix = getPrefix()
	storage.delete(prefix + 'getChannels')
	storage.delete(prefix + 'getAllChannels')
}