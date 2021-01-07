import compileWordPatterns from 'social-components/commonjs/utility/post/compileWordPatterns'
import { applyDarkMode, autoDarkMode, applyFontSize, applyLeftHanded } from 'webapp-frontend/src/utility/style'

import configuration from '../configuration'
import { getLanguageNames } from '../messages'
import { setDarkMode } from '../redux/app'
import { applyTheme } from './themes'
import getDefaultSettings from './settingsDefaults'
import UserSettings from './UserSettings'
import getLanguageFromLocale from './getLanguageFromLocale'
import getCensoredWordsByLanguage from './getCensoredWordsByLanguage'

class Settings {
	constructor(storage) {
		this.storage = storage
	}

	async apply({ dispatch }) {
		const settings = this.get()
		autoDarkMode(
			settings.autoDarkMode,
			value => dispatch(setDarkMode(value))
		)
		if (!settings.autoDarkMode) {
			dispatch(setDarkMode(settings.darkMode))
		}
		applyFontSize(settings.fontSize)
		applyLeftHanded(settings.leftHanded)
		// The theme is applied last because it's asynchronous.
		await applyTheme(settings.theme)
		return settings
	}

	get() {
		const settings = {
			...getDefaultSettings(),
			...this.getCustomSettings()
		}
		// Compile censored word patterns.
		if (settings.censorWords) {
			const censoredWords = settings.censoredWords || getCensoredWordsByLanguage(getLanguageFromLocale(settings.locale))
			settings.censoredWords = compileWordPatterns(censoredWords, getLanguageFromLocale(settings.locale))
		}
		return settings
	}

	getCustomSettings() {
		return this.storage.get()
	}
}

const settings = new Settings(UserSettings)

export default settings