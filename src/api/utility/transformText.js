import getLanguageFromLocale from '../../utility/getLanguageFromLocale.js'

import correctGrammar from './correctGrammar.js'
import _replaceQuotes from './replaceQuotes.js'

/**
 * Corrects text grammar (naive implementation), and (optionally)
 * replaces generic quote characters with language-specific ones.
 * @param  {string} text
 * @param  {boolean} [options.grammarCorrection]
 * @param  {string} [options.locale]
 * @param  {boolean} [options.replaceQuotes] — Pass `true` to replace quote characters.
 * @param  {function} [options.onUnpairedQuote] — Is called whenever an "unparied" quote is encountered.
 * @return {string}
 */
export default function transformText(text, {
	grammarCorrection,
	locale,
	replaceQuotes,
	onUnpairedQuote
}) {
	const language = getLanguageFromLocale(locale)
	// Grammar autocorrection is turned off by default so that it
	// doesn't interfere with the cases when the author intended to
	// post certain content in a certain way: posting promocodes,
	// posting code or data outside of `<code/>` blocks, etc.
	if (grammarCorrection) {
		text = correctGrammar(text, {
			language
		})
		// Correct quotes.
		// Example: `"one"` -> `«one»`
		// (must not preceed `correctGrammar()`)
		if (replaceQuotes && language) {
			text = _replaceQuotes(text, { language, onUnpairedQuote })
		}
	}
	return text
}
