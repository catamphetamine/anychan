import de from './de.json' assert { type: 'json' }
import en from './en.json' assert { type: 'json' }
import ru from './ru.json' assert { type: 'json' }

import deBase from 'frontend-lib/messages/de.json' assert { type: 'json' }
import enBase from 'frontend-lib/messages/en.json' assert { type: 'json' }
import ruBase from 'frontend-lib/messages/ru.json' assert { type: 'json' }

import deSocial from 'social-components/messages/de.json' assert { type: 'json' }
import enSocial from 'social-components/messages/en.json' assert { type: 'json' }
import ruSocial from 'social-components/messages/ru.json' assert { type: 'json' }

import deSocialReact from 'social-components-react/messages/de.json' assert { type: 'json' }
import enSocialReact from 'social-components-react/messages/en.json' assert { type: 'json' }
import ruSocialReact from 'social-components-react/messages/ru.json' assert { type: 'json' }

import deCountries from 'frontend-lib/messages/countries.de.json' assert { type: 'json' }
import enCountries from 'frontend-lib/messages/countries.en.json' assert { type: 'json' }
import ruCountries from 'frontend-lib/messages/countries.ru.json' assert { type: 'json' }

import Messages from 'frontend-lib/messages/Messages.js'
import mergeMessages from 'frontend-lib/messages/mergeMessages.js'

const messages = new Messages({
	de: mergeMessages(de, deBase, deSocial, deSocialReact),
	en: mergeMessages(en, enBase, enSocial, enSocialReact),
	ru: mergeMessages(ru, ruBase, ruSocial, ruSocialReact)
}, 'en')

if (typeof window !== 'undefined') {
	// App hosters will be able to customize labels via the global LABELS variable.
	// Example: LABELS.ru.settings.theme.title = "Тема"
	window.LABELS = messages.messages
}

export const getLanguageNames = messages.getLanguageNames
export const defaultLanguage = messages.defaultLanguage
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