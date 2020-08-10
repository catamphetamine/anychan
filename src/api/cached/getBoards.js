import getBoards from '../getBoards'
import { getPrefix } from '../../utility/localStorage'
import configuration from '../../configuration'

import LocalStorage from 'webapp-frontend/src/utility/storage/LocalStorage'

const storage = new LocalStorage()

/**
 * Caches `getBoards()` result for a day.
 * This is to avoid re-fetching `boards.json` needlessly
 * every time a user opens a page in a new tab.
 * @param {boolean} [all] — The `all` option of `getBoards()`.
 * @param {object} http — `react-pages` `http` utility.
 * @return {object} `getBoards()` result.
 */
export default async function getBoardsCached({
	all,
	http
}) {
	const prefix = getPrefix()
	const key = prefix + (all ? 'getAllBoards' : 'getBoards')
	const cached = storage.get(key)
	if (cached && cached.timestamp + configuration.boardsCacheTimeout >= Date.now()) {
		return cached.value
	}
	// Fetch the list of boards and cache it with the current timestamp.
	const result = await getBoards({
		all,
		http
	})
	storage.set(key, {
		timestamp: Date.now(),
		value: result
	})
	return result
}

export function clearBoardsCache() {
	const prefix = getPrefix()
	storage.delete(prefix + 'getBoards')
	storage.delete(prefix + 'getAllBoards')
}