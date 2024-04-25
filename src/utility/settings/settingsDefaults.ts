import type { Theme, Background, UserSettingsJson } from '../../types/UserSettings.js'

import getConfiguration from '../../getConfiguration.js'

import getDefaultLanguage_ from '../../messages/getDefaultLanguage.js'
import getLanguageNames from '../../messages/getLanguageNames.js'

export const DEFAULT_BACKGROUNDS_DARK_MODE: Background[] = [{
	id: 'Dark Blue',
	name: 'Dark Blue',
	gradientColor1: 'hsl(0deg 0% 15%)',
	gradientColor2: 'hsl(0deg 0% 20%)',
	patternOpacity: 0.1,
	backgroundColor: 'hsl(241deg 10% 11.75%)'
}, {
	id: 'Purple',
	name: 'Purple',
	gradientColor1: 'hsl(19deg 27% 17%)',
	gradientColor2: 'hsl(284deg 46% 21%)',
	patternOpacity: 0.15,
	backgroundColor: 'hsl(259, 45%, 11%)'
}, {
	id: 'Monochrome',
	name: 'Monochrome',
	gradientColor1: 'hsl(0deg 0% 19.8%)',
	gradientColor2: 'hsl(0deg 0% 83.69%)',
	patternOpacity: 0.1,
	backgroundColor: 'hsl(0deg 0% 10%)'
}]

export const DEFAULT_BACKGROUNDS_LIGHT_MODE: Background[] = [{
	id: 'Orange Purple',
	name: 'Orange Purple',
	gradientColor1: 'hsl(34deg 53% 66%)',
	gradientColor2: 'hsl(0deg 46% 70%)'
 }, {
	id: 'Purple Blue',
	name: 'Purple Blue',
	gradientColor1: 'hsl(11deg 21% 64%)',
	gradientColor2: 'hsl(208deg 20% 62%)'
}, {
	id: 'Green Brown',
	name: 'Green Brown',
	gradientColor1: 'hsl(52deg 28% 67%)',
	gradientColor2: 'hsl(18deg 49% 71%)'
}]

export function getDefaultBackgrounds(type: 'dark' | 'light') {
	switch (type) {
		case 'dark':
			return DEFAULT_BACKGROUNDS_DARK_MODE
		case 'light':
			return DEFAULT_BACKGROUNDS_LIGHT_MODE
	}
}

export function getDefaultBackgroundId(type: 'dark' | 'light') {
	switch (type) {
		case 'dark':
			return getConfiguration().defaultBackgroundDarkMode || DEFAULT_BACKGROUNDS_DARK_MODE[0].id
		case 'light':
			return getConfiguration().defaultBackgroundLightMode || DEFAULT_BACKGROUNDS_LIGHT_MODE[0].id
	}
}

// `DEFAULT_THEMES` will be overridden by a proper default themes list
// when the code is run after being compiled by Webpack.
// The reason is that otherwise console tests wouldn't work
// because `import`ing `*.css` files doesn't work outside of Webpack.
let DEFAULT_THEMES: Theme[] = [
	{
		id: 'default',
		name: 'Default',
		url: 'https://example.com/theme.css'
	}
]

export function getDefaultThemes() {
	return DEFAULT_THEMES
}

export function setDefaultThemes(defaultThemes: Theme[]) {
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

function isSupportedLanguage(language: string) {
	return SUPPORTED_LANGUAGES.includes(language)
}

export function getDefaultSettings(): UserSettingsJson {
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
		backgroundLightMode: getDefaultBackgroundId('light'),
		backgroundDarkMode: getDefaultBackgroundId('dark'),
		...getConfiguration().defaultSettings
	}
}