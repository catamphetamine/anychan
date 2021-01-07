const LETTERS_REG_EXP = /^[a-z]+$/

export default function getLanguageFromLocale(locale) {
	if (!LETTERS_REG_EXP.test(locale)) {
		reportError(`A "locale" is not supposed to contain non-alpha characters: ${locale}`)
	}
	return locale
}

function reportError(message) {
	if (typeof window !== 'undefined') {
		setTimeout(() => {
			throw new Error(message)
		}, 0)
	}
}