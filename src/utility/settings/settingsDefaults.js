import getConfiguration from '../../configuration.js'

import { defaultLanguage, getLanguageNames } from '../../messages/index.js'

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
	if (typeof window !== 'undefined') {
		if (isSupportedLanguage(navigator.language)) {
			return navigator.language
		}
	}
	return defaultLanguage
}

const SUPPORTED_LANGUAGES = Object.keys(getLanguageNames())

function isSupportedLanguage(language) {
	return SUPPORTED_LANGUAGES.includes(language)
}

export default function getDefaultSettings() {
	return {
		fontSize: 'm',
		darkMode: false,
		autoDarkMode: true,
		censorWords: true,
		channelView: 'new-threads',
		theme: getDefaultThemeId(),
		locale: getDefaultLanguage(),
		...getConfiguration().defaultSettings
	}
}