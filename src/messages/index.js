import en from './en.json'
import ru from './ru.json'

import enCountries from './countries.en.json'
import ruCountries from './countries.ru.json'

export function getLanguageNames() {
	return {
		'en': en.languageName,
		'ru': ru.languageName
	}
}

export default function getMessages(language) {
	switch (language) {
		case 'en':
			return en
		case 'ru':
			return ru
		default:
			throw new Error(`Unsupported language: ${language}`)
	}
}

export function getCountryNames(language) {
	switch (language) {
		case 'en':
			return enCountries
		case 'ru':
			return ruCountries
		default:
			throw new Error(`Unsupported language: ${language}`)
	}
}

export function isSupportedLanguage(language) {
	return getLanguageNames()[language] !== undefined
}