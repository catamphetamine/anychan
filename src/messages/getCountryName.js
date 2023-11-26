import messagesLabelsCountries from './messagesLabelsCountries.js'
import getDefaultLanguage from './getDefaultLanguage.js'
import reportError from '../utility/reportError.js'

export default function getCountryName(countryCode, language) {
	return getCountryNames(language)[countryCode] || countryCode
}

function getCountryNames(language) {
	const messagesLabels = messagesLabelsCountries[language]
	if (messagesLabels) {
		return messagesLabels
	}

	// Report the error to `sentry.io`.
	reportError(new Error(`Unsupported language when getting country names: ${language}`))

	return getCountryNames(getDefaultLanguage())
}