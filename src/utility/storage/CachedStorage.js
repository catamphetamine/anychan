import { CachedStorage } from 'web-browser-storage/cache'

import storage from './storage.js'
import matchesPattern from '../matchesPattern.js'

// See the comments in `web-browser-storage/lib/CachedStorage.js`
// on the rationale for caching.
export default class CachedStorage_ extends CachedStorage {
	constructor(options) {
		super({
			...options,
			flushDelay: 30 * 1000,
			storage,
			matchesPattern(key, pattern) {
				return matchesPattern(key, pattern, {
					asteriskExcludeCharacter: '/',
					asteriskOneOrMoreCharacters: true
				})
			}
		})
	}
}