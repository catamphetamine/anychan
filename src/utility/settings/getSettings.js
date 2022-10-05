import compileWordPatterns from 'social-components/utility/post/compileWordPatterns.js'

import getLanguageFromLocale from '../getLanguageFromLocale.js'
import getCensoredWordsByLanguage from '../getCensoredWordsByLanguage.js'
import getDefaultSettings from './settingsDefaults.js'

import getUserSettings from '../../UserSettings.js'

export default function getSettings({ userSettings = getUserSettings() } = {}) {
	const settings = {
		...getDefaultSettings(),
		...userSettings.get()
	}
	// Compile censored word patterns.
	if (settings.censorWords) {
		const censoredWords = settings.censoredWords || getCensoredWordsByLanguage(getLanguageFromLocale(settings.locale))
		settings.censoredWords = compileWordPatterns(censoredWords, getLanguageFromLocale(settings.locale))
	}
	return settings
}