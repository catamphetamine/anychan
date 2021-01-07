import configuration from '../configuration'
import { addBasePath } from './getBasePath'

import DefaultThemeUrl from '../styles/theme/default.css'
import NeonGenesisEvangelionThemeUrl from '../styles/theme/neon-genesis-evangelion.css'

import { defaultLanguage, getLanguageNames } from '../messages'

export const DEFAULT_THEMES = [
	{
		id: 'default',
		name: 'Default',
		url: addBasePath(DefaultThemeUrl)
	},
	{
		id: 'neon-genesis-evangelion',
		name: 'Neon Genesis Evangelion',
		url: addBasePath(NeonGenesisEvangelionThemeUrl)
	}
]

export function getDefaultThemeId() {
	return configuration.defaultTheme || DEFAULT_THEMES[0].id
}

function getDefaultLanguage() {
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
		theme: getDefaultThemeId(),
		locale: getDefaultLanguage(),
		...configuration.defaultSettings
	}
}