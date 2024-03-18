import compileWordPatterns from 'social-components/utility/post/compileWordPatterns.js'

import getLanguageFromLocale from '../getLanguageFromLocale.js'
import getCensoredWordsByLanguage from '../getCensoredWordsByLanguage.js'
import { getDefaultSettings } from './settingsDefaults.js'

// * Applies default settings for the parameters that don't have a custom value.
// * Compiles censored words list.
export default function getSettings({ userSettings, settings, ...rest }) {
	// If `userSettings` parameter was passed, convert it to `settings` object
	// and call the function again.
	if (userSettings) {
		return getSettings({
			settings: userSettings.get(),
			...rest
		})
	}

	settings = {
		...getDefaultSettings(),
		...settings
	}

	// Compile censored word patterns.
	if (settings.censorWords) {
		const censoredWords = settings.censoredWords || getCensoredWordsByLanguage(getLanguageFromLocale(settings.locale))
		settings.censoredWords = compileWordPatterns(censoredWords, getLanguageFromLocale(settings.locale))
	}

	return settings
}