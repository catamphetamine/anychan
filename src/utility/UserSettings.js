import LocalStorage from 'webapp-frontend/src/utility/LocalStorage'

class UserSettings {
	constructor(storage) {
		this.storage = storage
	}

	get(name, defaultValue) {
		const settings = this.storage.get('settings', {})
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
			this.storage.delete('settings')
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
		this.storage.set('settings', settings)
	}
}

export default new UserSettings(new LocalStorage())