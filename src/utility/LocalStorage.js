import {
	getObject,
	setObject,
	deleteObject,
	forEach as forEachLocalStorage
} from 'webapp-frontend/src/utility/localStorage'

class LocalStorage {
	get(key, defaultValue) {
		return getObject(key, defaultValue)
	}
	set(key, value) {
		return setObject(key, value)
	}
	delete(key) {
		return deleteObject(key)
	}
	forEach(func) {
		forEachLocalStorage(func)
	}
}

export default class CachedLocalStorage extends LocalStorage {
	get(key, defaultValue) {
		if (this.cache && this.cache[key]) {
			return this.cache[key]
		}
		return super.get(key, defaultValue)
	}
	set(key, value) {
		if (this.cache) {
			this.cache[key] = value
		}
		return super.set(key, value)
	}
	delete(key) {
		if (this.cache) {
			delete this.cache[key]
		}
		return super.delete(key)
	}
	cache(cache) {
		if (cache) {
			this.cache = {}
		} else {
			this.cache = undefined
		}
	}
}