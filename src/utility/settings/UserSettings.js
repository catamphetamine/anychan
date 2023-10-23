import schemaValidation from 'flexible-json-schema'

import { getDefaultSettings } from './settingsDefaults.js'
import settingsSchema from './settingsSchema.json' assert { type: 'json' }
import migrate from './UserSettings.migrate.js'

// Current version of user settings.
// See `UserSettings.migrate.js` comments for the changelog.
const VERSION = 3

const validateSettings_ = schemaValidation(settingsSchema)

export default class UserSettings {
	constructor(storage, { prefix = '' } = {}) {
		this.storage = storage
		this.prefix = prefix
		this.key = this.prefix + 'settings'
	}

	// Migrate settings.
	migrate() {
		const data = this.storage.get(this.key)
		migrate(data, data.version)
		data.version = VERSION
		this.storage.set(this.key, data)
	}

	requiresMigration() {
		const data = this.storage.get(this.key)
		if (data) {
			return data.version !== VERSION
		}
	}

	get(name) {
		const settings = this.storage.get(this.key) || {}

		// Validate settings.
		validateSettings(settings)

		if (name) {
			return settings[name]
			// const value = settings[name]
			// if (value === undefined) {
			// 	return defaultValue
			// }
			// return value
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
			// Don't mention the default setting values explicitly.
			if (value === getDefaultSettings()[name]) {
				value = undefined
			}
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

		// Validate settings.
		validateSettings(settings)

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

	onExternalChange(handler) {
		return this.storage.onExternalChange(({ key }) => {
			if (key) {
				if (this.matchKey(key)) {
					handler()
				}
			} else {
				handler()
			}
		})
	}
}

function validateSettings(settings) {
	// Validate settings.
	try {
		validateSettings_(settings)
	} catch (error) {
		console.error('Settings object seems to be not valid:')
		console.error(error)
		console.log(settings)
	}
}