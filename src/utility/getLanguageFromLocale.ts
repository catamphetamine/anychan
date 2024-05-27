import reportError from './reportError.js'

const LETTERS_REG_EXP = /^[a-z]+$/

export default function getLanguageFromLocale(locale: string): string {
	if (!LETTERS_REG_EXP.test(locale)) {
		reportError(new Error(`A "locale" is not supposed to contain non-alpha characters: ${locale}`))
	}
	return locale
}