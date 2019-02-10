import { getPreferredLocale } from 'react-website'

import {
	IGNORED_WORDS,
	IGNORED_WORDS_CASE_SENSITIVE,
	IGNORED_PATTERNS,
	IGNORED_PATTERNS_CASE_SENSITIVE
} from './settings.filters'

import { applyFontSize } from './theme'

import {
	isSupportedLanguage
} from '../messages'

export function getDefaultSettings() {
	return {
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