import en from './en.json'
import ru from './ru.json'

import enBase from 'webapp-frontend/src/messages/en.json'
import ruBase from 'webapp-frontend/src/messages/ru.json'

import deCountries from 'webapp-frontend/src/messages/countries.de.json'
import enCountries from 'webapp-frontend/src/messages/countries.en.json'
import ruCountries from 'webapp-frontend/src/messages/countries.ru.json'

import Messages, { mergeMessages } from 'webapp-frontend/src/messages'

const messages = new Messages({
	en: mergeMessages(enBase, en),
	ru: mergeMessages(ruBase, ru)
}, 'en')

export const getLanguageNames = messages.getLanguageNames
export default messages.getMessages

export function getCountryName(country, language) {
	return getCountryNames(language)[country] || country
}

function getCountryNames(language) {
	switch (language) {
		case 'de':
			return deCountries
		case 'en':
			return enCountries
		case 'ru':
			return ruCountries
		default:
			// Report the error to `sentry.io`.
			setTimeout(() => {
				throw new Error(`Unsupported language: ${language}`)
			}, 0)
			return enCountries
	}
}