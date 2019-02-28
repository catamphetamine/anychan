import { getPreferredLocale } from 'react-website'

import {
	IGNORED_WORDS,
	IGNORED_WORDS_CASE_SENSITIVE,
	IGNORED_PATTERNS,
	IGNORED_PATTERNS_CASE_SENSITIVE
} from './settings.filters'

import {
	isSupportedLanguage
} from '../messages'

export function getDefaultSettings() {
	return {
		theme: 'default',
		fontSize: 'medium',
		locale: getDefaultLocale(),
		filters: {
			ignoredWords: IGNORED_WORDS,
			ignoredWordsCaseSensitive: IGNORED_WORDS_CASE_SENSITIVE,
			ignoredPatterns: IGNORED_PATTERNS,
			ignoredPatternsCaseSensitive: IGNORED_PATTERNS_CASE_SENSITIVE
		}
	}
}

export function applySettings(settings) {
	if (settings.fontSize) {
		applyFontSize(settings.fontSize)
	}
}

function getDefaultLocale() {
	if (typeof window !== 'undefined') {
		if (isSupportedLanguage(navigator.language)) {
			return navigator.language
		}
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