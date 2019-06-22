import {
	getObject,
	setObject,
	deleteObject,
	forEach as forEachLocalStorage
} from 'webapp-frontend/src/utility/localStorage'

export default class LocalStorage {
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