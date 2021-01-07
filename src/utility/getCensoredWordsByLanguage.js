import IGNORED_WORDS_DE from 'webapp-frontend/src/messages/offensive.de.json'
import IGNORED_WORDS_EN from 'webapp-frontend/src/messages/offensive.en.json'
import IGNORED_WORDS_RU from 'webapp-frontend/src/messages/offensive.ru.json'

import configuration from '../configuration'

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