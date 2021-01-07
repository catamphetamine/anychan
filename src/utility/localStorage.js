import { getProviderId } from '../provider'

export function getPrefix(prefix, providerId = getProviderId()) {
	return prefix === undefined ?
		'captchan.' + (providerId ? providerId + '.' : '') :
		prefix
}

export function migrate() {
	// Remove the legacy-named "getAllBoards" cache.
	if (localStorage.getItem(getPrefix() + 'getAllBoards')) {
		localStorage.removeItem(getPrefix() + 'getAllBoards')
	}
	// Remove the legacy-named "getBoards" cache.
	if (localStorage.getItem(getPrefix() + 'getBoards')) {
		localStorage.removeItem(getPrefix() + 'getBoards')
	}
}