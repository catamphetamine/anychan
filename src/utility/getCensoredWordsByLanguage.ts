import IGNORED_WORDS_DE from 'frontend-lib/messages/offensive.de.json' assert { type: 'json' }
import IGNORED_WORDS_EN from 'frontend-lib/messages/offensive.en.json' assert { type: 'json' }
import IGNORED_WORDS_RU from 'frontend-lib/messages/offensive.ru.json' assert { type: 'json' }

import getConfiguration from '../getConfiguration.js'

export default function getCensoredWordsByLanguage(language: string): string[] {
	if (getConfiguration().defaultCensoredWords) {
		if (getConfiguration().defaultCensoredWords[language]) {
			return getConfiguration().defaultCensoredWords[language]
		}
	}
	switch (language) {
		case 'de':
			return IGNORED_WORDS_DE
		case 'en':
			return IGNORED_WORDS_EN
		case 'ru':
			return IGNORED_WORDS_RU
		default:
			return []
	}
}