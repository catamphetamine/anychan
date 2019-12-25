import LocalStorage from 'webapp-frontend/src/utility/LocalStorage'
import { getChan } from '../chan'
import migrate from './UserSettings.migrate'

// Current version of user settings.
// See `UserSettings.migrate.js` comments for the changelog.
const VERSION = 1

class UserSettings {
	constructor(storage, options = {}) {
		this.storage = storage
		this.prefix = options.prefix === undefined ?
			'captchan.' + (options.chanId ? options.chanId + '.' : '') :
			options.prefix
		this.key = this.prefix + 'settings'
		// Migrate settings.
		const data = this.storage.get(this.key, {})
		if (data.version !== VERSION) {
			migrate(data, data.version)
			data.version = VERSION
			this.storage.set(this.key, data)
		}
	}

	get(name, defaultValue) {
		const settings = this.storage.get(this.key, {})
		if (name) {
			const value = settings[name]
			if (value === undefined) {
				return defaultValue
			}
			return value
		} else {
			return settings
		}
	}

	reset(name) {
		if (name) {
			const settings = this.get()
			if (settings[name] !== undefined) {
				delete settings[name]
				this.set(settings)
			}
		} else {
			this.storage.delete(this.key)
		}
	}

	set(name, value) {
		let settings
		if (typeof name === 'string') {
			settings = this.get()
			if (value === undefined) {
				delete settings[name]
			} else {
				settings[name] = value
			}
		} else {
			settings = name
		}
		if (!settings.version) {
			settings.version = VERSION
		}
		this.storage.set(this.key, settings)
	}

	replace(settings) {
		if (settings.version !== VERSION) {
			migrate(settings, settings.version)
			settings.version = VERSION
		}
		this.storage.set(this.key, settings)
	}

	matchKey(key) {
		return key === this.key
	}
}

export default new UserSettings(new LocalStorage(), {
	chanId: getChan().id
})