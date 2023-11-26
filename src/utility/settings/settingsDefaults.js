import getConfiguration from '../../configuration.js'

import getDefaultLanguage_ from '../../messages/getDefaultLanguage.js'
import getLanguageNames from '../../messages/getLanguageNames.js'

export const DEFAULT_BACKGROUNDS_DARK_MODE = ['Purple', 'Dark Blue', 'Monochrome']
export const DEFAULT_BACKGROUNDS_LIGHT_MODE = ['Orange Purple', 'Purple Blue', 'Green Brown']

// `DEFAULT_THEMES` will be overridden by a proper default themes list
// when the code is run after being compiled by Webpack.
// The reason is that otherwise console tests wouldn't work
// because `import`ing `*.css` files doesn't work outside of Webpack.
let DEFAULT_THEMES = [
	{
		id: 'default',
		name: 'Default',
		url: 'https://example.com/theme.css'
	}
]

export function getDefaultThemes() {
	return DEFAULT_THEMES
}

export function setDefaultThemes(defaultThemes) {
	DEFAULT_THEMES = defaultThemes
}

export function getDefaultThemeId() {
	return getConfiguration().defaultTheme || DEFAULT_THEMES[0].id
}

export function getDefaultLanguage() {
	// When running in a web browser, prefer `navigator.language`
	// over the "fallback" default language.
	// `navigator.language` is the user's preferred language
	// either configured in the web browser or in the Operating System.
	if (typeof window !== 'undefined') {
		if (isSupportedLanguage(navigator.language)) {
			return navigator.language
		}
	}

	// Use the "fallback" default language.
	return getDefaultLanguage_()
}

const SUPPORTED_LANGUAGES = Object.keys(getLanguageNames())

function isSupportedLanguage(language) {
	return SUPPORTED_LANGUAGES.includes(language)
}

export function getDefaultSettings() {
	return {
		fontSize: 'm',
		darkMode: false,
		autoDarkMode: true,
		censorWords: true,
		autoSuggestFavoriteChannels: true,
		channelLayout: 'threadsList',
		channelSorting: 'default',
		theme: getDefaultThemeId(),
		locale: getDefaultLanguage(),
		...getConfiguration().defaultSettings
	}
}