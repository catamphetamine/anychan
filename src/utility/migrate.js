import { getProviderById } from '../provider.js'
import getPrefix, { BASE_PREFIX } from './storage/getStoragePrefix.js'
import compareVersions from './semver-compare.js'
import storage_ from './storage/storage.js'

const debug = (...args) => console.log(['Migration'].concat(args))

// No longer used (too long).
const BASE_PREFIX_LEGACY = 'captchan.'

// The initial version is `1`.
// It renamed all collections from 'captchan.' prefix to '⌨️' prefix.
const VERSION = 1

export default function migrate({
	collections,
	storage = storage_
}) {
	const info = storage.get(BASE_PREFIX) || {}
	migrate_(info, { collections, storage })
	info.version = VERSION
	storage.set(BASE_PREFIX, info)
}

export function requiresMigration({ storage = storage_ } = {}) {
	const info = storage.get(BASE_PREFIX) || {}
	const { version } = info
	return version !== VERSION
}

function migrate_({ version }, {
	collections,
	storage,
	log = debug
}) {
	log('Start')

	// Perform a migration from "version: 0".
	if (!version) {
		// Move all `captchan.`-prefixed `localStorage` records
		// to `⌨️`-prefixed ones.
		for (const key of storage.keys()) {
			if (key.indexOf(BASE_PREFIX_LEGACY) === 0) {
				let newKey = key.replace(BASE_PREFIX_LEGACY, BASE_PREFIX)
				// Replace a dot after a provider prefix with a colon,
				// if there is a provider prefix.
				if (newKey.includes('.')) {
					const providerId = newKey.slice(BASE_PREFIX.length, newKey.indexOf('.'))
					const provider = getProviderById(providerId)
					if (provider) {
						const { shortId } = provider
						if (shortId) {
							newKey = newKey.replace(providerId + '.', shortId)
						} else {
							console.error(`Provider "shortId" not defined when migrating local storage record key prefixes for provider "${providerId}"`)
						}
					} else {
						console.error(`Provider not found when migrating local storage record key prefixes: "${providerId}"`)
					}
				}
				storage.set(newKey, storage.get(key))
				storage.delete(key)
			}
		}

		// Replace collection names with their short names, when defined.
		for (const key of storage.keys()) {
			if (key.startsWith(BASE_PREFIX)) {
				for (const collectionName of Object.keys(collections)) {
					const collection = collections[collectionName]
					if (collection.shortName) {
						if (key.endsWith(collection.name)) {
							const newKey = key.replace(collection.name, collection.shortName)
							storage.set(newKey, storage.get(key))
							storage.delete(key)
						}
					}
				}
			}
		}

		// Clear legacy "boards"/"all boards" caches.
		//
		// "All boards" cache on `8ch` is about 100kB in size. Not too big.
		// Could be cleaned as part of the "scheduled clean-up" procedure.
		//
		// function getLegacyPrefix() {
		// 	return getPrefix().replace(BASE_PREFIX, BASE_PREFIX_LEGACY).replace(providerShortId, providerId)
		// }
		// // Remove the legacy-named "getAllBoards" cache.
		// if (localStorage.getItem(getLegacyPrefix() + 'getAllBoards')) {
		// 	localStorage.removeItem(getLegacyPrefix() + 'getAllBoards')
		// }
		// // Remove the legacy-named "getBoards" cache.
		// if (localStorage.getItem(getLegacyPrefix() + 'getBoards')) {
		// 	localStorage.removeItem(getLegacyPrefix() + 'getBoards')
		// }

		return
	}

	// Optionally migrate something.
	// if (isEarlierThan(version, '1.0.0')) {
	// 	...
	// }

	log('Finished')
}

function isEarlierThan(version1, version2) {
	return compareVersions(version1, version2) < 0
}