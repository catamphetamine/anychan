import LocalStorage from 'webapp-frontend/src/utility/LocalStorage'
import { getChan } from '../chan'

// Current version of user settings.
// See `.migrate()` method comments for the changelog.
const VERSION = 1

class UserSettings {
	constructor(storage, options = {}) {
		this.storage = storage
		this.prefix = options.prefix === undefined ?
			'captchan.' + (options.chanId ? options.chanId + '.' : '') :
			options.prefix
		this.key = this.prefix + 'settings'
		this.migrate()
	}

	migrate() {
		const version = this.get('version', 0)
		if (version === VERSION) {
			return
		}
		// Version 1.
		// Dec 24, 2019.
		// Renamed `fontSize`s: "small", "medium", "large" -> "xs", "s", "m", "l", "xl".
		if (version < 1) {
			const fontSize = this.get('fontSize')
			if (fontSize) {
				this.set('fontSize', migrateFontSize(fontSize))
			}
		}
		this.set('version', VERSION)
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
		this.storage.set(this.key, settings)
	}

	matchKey(key) {
		return key === this.key
	}
}

export default new UserSettings(new LocalStorage(), {
	chanId: getChan().id
})

// Version 1.
// Dec 24, 2019.
// Renamed `fontSize`s: "small", "medium", "large" -> "xs", "s", "m", "l", "xl".
function migrateFontSize(fontSize) {
	switch (fontSize) {
		case 'small':
			return 's'
		case 'medium':
			return 'm'
		case 'large':
			return 'l'
	}
}