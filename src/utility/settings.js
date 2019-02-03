import { getPreferredLocale } from 'react-website'

import {
	IGNORED_WORDS,
	IGNORED_WORDS_CASE_SENSITIVE,
	IGNORED_PATTERNS,
	IGNORED_PATTERNS_CASE_SENSITIVE
} from './settings.filters'

const SUPPORTED_LANGUAGES = ['ru', 'en']

export function getDefaultSettings() {
	return {
		locale: (typeof window === 'undefined' ? null : (SUPPORTED_LANGUAGES.includes(navigator.language) ? navigator.language : null)) || 'en',
		filters: {
			ignoredWords: IGNORED_WORDS,
			ignoredWordsCaseSensitive: IGNORED_WORDS_CASE_SENSITIVE,
			ignoredPatterns: IGNORED_PATTERNS,
			ignoredPatternsCaseSensitive: IGNORED_PATTERNS_CASE_SENSITIVE
		}
	}
}