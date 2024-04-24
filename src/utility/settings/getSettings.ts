import type { UserSettings, UserSettingsJson } from '../../types/index.js'

import { compileWordPatterns } from 'social-components/text'

import getLanguageFromLocale from '../getLanguageFromLocale.js'
import getCensoredWordsByLanguage from '../getCensoredWordsByLanguage.js'
import { getDefaultSettings } from './settingsDefaults.js'

// * Applies default settings for the parameters that don't have a custom value.
// * Compiles censored words list.
export default function getSettings({ userSettings, settings, ...rest }: { userSettings?: UserSettings, settings?: UserSettingsJson }) {
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
		const censoredWordsPatterns = settings.censoredWordsPatterns || getCensoredWordsByLanguage(getLanguageFromLocale(settings.locale))
		settings.censoredWords = compileWordPatterns(censoredWordsPatterns, getLanguageFromLocale(settings.locale))
	}

	return settings
}