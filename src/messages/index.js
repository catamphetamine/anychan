import en from './en.json'
import ru from './ru.json'

import enCountries from './countries.en.json'
import ruCountries from './countries.ru.json'

addMissingMessages(ru, en)

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

function addMissingMessages(to, from) {
	for (const key of Object.keys(from)) {
		// Skip `null`s.
		// For example, some phrases in English have no prefix
		// while in other languages they do.
		// For example, if a title contains a hyperlinked substring
		// the message has to be split into three substrings:
		// "before", "linked text" and "after".
		// English may not have the "before" part, for example.
		// In such cases it's explicitly marked as `null`.
		if (from[key] === null || to[key] === null) {
			continue
		}
		if (to[key] === undefined) {
			// Fill in missing keys.
			to[key] = from[key]
		} else if (typeof from[key] !== typeof to[key]) {
			// Replace strings with nested objects.
			to[key] = from[key]
		} else if (typeof from[key] !== 'string') {
			// Recurse into nested objects.
			addMissingMessages(to[key], from[key])
		}
	}
}