import { getPreferredLocale } from 'react-website'

import IGNORED_WORDS_RU from '../messages/offensive.ru.json'
import IGNORED_WORDS_EN from '../messages/offensive.en.json'

import {
	isSupportedLanguage
} from '../messages'

import { getChan } from '../chan'
import compileFilters from '../chan-parser/compileFilters'

function getDefaultSettings() {
	return {
		theme: 'default',
		fontSize: 'medium',
		locale: getDefaultLanguage(),
		filters: getIgnoredWordsByLanguage(getChan().language)
	}
}

export function applySettings(settings) {
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

export function getSettings(customSettings) {
	const settings = {
		...getDefaultSettings(),
		...customSettings
	}
	// Compile filters.
	settings.filters = compileFilters(settings.filters, getChan().language)
	return settings
}