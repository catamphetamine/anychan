import ru from './ru.json'
import en from './en.json'

export function getLanguageNames() {
	return {
		'ru': ru.languageName,
		'en': en.languageName
	}
}

export default function getMessages(language) {
	switch (language) {
		case 'ru':
			return ru
		case 'en':
			return en
		default:
			throw new Error(`Unsupported language: ${language}`)
	}
}

export function isSupportedLanguage(language) {
	return getLanguageNames()[language] !== undefined
}