import { getPreferredLocale } from 'react-website'
import loadStylesheet from 'webapp-frontend/src/utility/loadStylesheet'

import IGNORED_WORDS_RU from '../messages/offensive.ru.json'
import IGNORED_WORDS_EN from '../messages/offensive.en.json'

import {
	isSupportedLanguage
} from '../messages'

import { getChan } from '../chan'
import compileFilters from '../chan-parser/compileFilters'

import UserSettings from './UserSettings'

import DefaultThemeUrl from '../styles/theme/default.css'
import NeonGenesisEvangelionThemeUrl from '../styles/theme/neon-genesis-evangelion.css'

function getDefaultSettings() {
	return {
		theme: 'default',
		fontSize: 'medium',
		locale: getDefaultLanguage(),
		filters: getIgnoredWordsByLanguage(getChan().language)
	}
}

export function applySettings() {
	const settings = getSettings()
	applyTheme(settings.theme)
	if (settings.fontSize) {
		applyFontSize(settings.fontSize)
	}
}

function getDefaultLanguage() {
	if (typeof window !== 'undefined') {
		if (isSupportedLanguage(navigator.language)) {
			return navigator.language
		}
	}
	if (isSupportedLanguage(getChan().langauge)) {
		return getChan().langauge
	}
	return 'en'
}

/**
 * Applies application theme.
 * @param  {string} theme
 */
export async function applyTheme(theme = getDefaultSettings().theme) {
	if (typeof theme === 'string') {
		theme = getTheme(theme)
	}
	const previousThemeStyle = document.head.querySelector('[data-theme]')
	const previousThemeName = previousThemeStyle && previousThemeStyle.dataset.theme
	if (previousThemeName === theme.name) {
		return
	}
	function finishSwitchingTheme(style) {
		style.setAttribute('data-theme', theme.name)
		for (const { name } of THEMES) {
			document.body.classList.remove(`theme--${name}`)
		}
		document.body.classList.add(`theme--${theme.name}`)
		if (previousThemeStyle) {
			document.head.removeChild(previousThemeStyle)
		}
	}
	if (theme.url) {
		const stylesheet = await loadStylesheet(theme.url)
		finishSwitchingTheme(stylesheet)
	} else {
		const style = document.createElement('style')
		style.appendChild(document.createTextNode(theme.code))
		document.head.appendChild(style)
		finishSwitchingTheme(style)
	}
}

export function getThemes() {
	return THEMES.concat(UserSettings.get().themes || [])
}

function getTheme(name) {
	return getThemes().find(_ => _.name === name)
}

export function isBuiltInTheme(name) {
	return THEMES.findIndex(_ => _.name === name) >= 0
}

export function addTheme(theme) {
	const themes = UserSettings.get('themes', [])
	const index = themes.findIndex(_ => _.name === theme.name)
	if (index >= 0) {
		themes[index] = theme
	} else {
		themes.push(theme)
	}
	UserSettings.set('themes', themes)
}

export function removeTheme(name) {
	const themes = UserSettings.get('themes', [])
	const index = themes.findIndex(_ => _.name === name)
	if (index >= 0) {
		themes.splice(index, 1)
		UserSettings.set('themes', themes)
	}
}

/**
 * Applies font size to document.
 * Both `html` and `body` elements are required to be updated
 * because `html` is required in order for `rem`s to work
 * and without `body` changing fonts doesn't work for some weird reason.
 * @param  {string} fontSize
 */
export function applyFontSize(fontSize) {
	for (const fontSize of FONT_SIZES) {
		document.documentElement.classList.remove(`font-size--${fontSize}`)
		document.body.classList.remove(`font-size--${fontSize}`)
	}
	document.documentElement.classList.add(`font-size--${fontSize}`)
	document.body.classList.add(`font-size--${fontSize}`)
}

export const THEMES = [
	{
		name: 'default',
		url: DefaultThemeUrl
	},
	{
		name: 'neon-genesis-evangelion',
		url: NeonGenesisEvangelionThemeUrl
	}
]

export const FONT_SIZES = [
	'small',
	'medium',
	'large'
]

export function getIgnoredWordsByLanguage(language) {
	switch (language) {
		case 'en':
			return IGNORED_WORDS_EN
		case 'ru':
			return IGNORED_WORDS_RU
		default:
			return []
	}
}

export function getSettings() {
	const settings = {
		...getDefaultSettings(),
		...UserSettings.get()
	}
	// Compile filters.
	settings.filters = compileFilters(settings.filters, getChan().language)
	return settings
}

export function getSettingsData() {
	return UserSettings.get()
}