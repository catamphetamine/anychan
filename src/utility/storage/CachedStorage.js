import { CachedStorage } from 'web-browser-storage/cache'

import Storage from './Storage.js'
import matchesPattern from '../matchesPattern.js'

// See the comments in `web-browser-storage/lib/CachedStorage.js`
// on the rationale for caching.
//
// Example: `UserData` uses `CachedStorage` to minimize writing to disk.
// Suppose a user rapidly scrolls through a thread with ~1000 comments.
// It would result in the same amount of writes to the "latest read comment ID"
// value in `UserData`. In order to prevent those needless excessive write operations
// to be dispatched, `CachedStorage` caches those writes and only dispatches the final one
// after some time passes, or when the user switches to a different tab, etc.
//
// A `CachedStorage` could be `start()`ed or `stop()`ped.
// A "started" `CachedStorage` would listen to external changes to `localStorage`
// from other windows or tabs and then refresh its internal cache accordingly.
//
export default class CachedStorage_ extends CachedStorage {
	constructor(options) {
		super({
			...options,
			flushDelay: 30 * 1000,
			storage: new Storage(options),
			matchesPattern(key, pattern) {
				return matchesPattern(key, pattern, {
					asteriskExcludeCharacter: '/',
					asteriskOneOrMoreCharacters: true
				})
			}
		})
	}
}