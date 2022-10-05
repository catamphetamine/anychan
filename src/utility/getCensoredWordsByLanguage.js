import IGNORED_WORDS_DE from 'frontend-lib/messages/offensive.de.json'
import IGNORED_WORDS_EN from 'frontend-lib/messages/offensive.en.json'
import IGNORED_WORDS_RU from 'frontend-lib/messages/offensive.ru.json'

import configuration from '../configuration.js'

export default function getCensoredWordsByLanguage(language) {
	if (configuration.defaultCensoredWords) {
		if (configuration.defaultCensoredWords[language]) {
			return configuration.defaultCensoredWords[language]
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