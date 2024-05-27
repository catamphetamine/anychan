// https://en.wikipedia.org/wiki/Quotation_mark#Specific_language_features
const QUOTES: Record<string, string[]> = {
	de: ['„', '“'],
	en: ['“', '”'],
	fi: ['”', '”'],
	// French uses angle quotation marks (guillemets, or duck-foot quotes),
	// adding a 'quarter-em space' within the quotes.
	// So, if a person already wrote regular (") quotes with the spaces,
	// that would mean not adding those spaces, and if the person wrote
	// the regular (") quotes without the spaces, then those spaces should be added.
	// So, it could be some kind of a bit more complex logic in case of implementing
	// French quotes.
	// fr: ['« ', ' »'],
	// jp: ['「', '」'],
	nl: ['„', '”'],
	ru: ['«', '»'],
	sv: ['”', '”']
}

interface Parameters {
	language: string;
	onUnpairedQuote?: () => void;
}

/**
 * Replaces generic quote characters with language-specific ones.
 * Also removes unneeded whitespace inside quotes.
 * @param  {string} text
 * @param  {object} options
 * @param  {string} options.language
 * @param  {function} [options.onUnpairedQuote] — Is called whenever an "unparied" quote is encountered.
 * @return {string}
 */
export default function replaceQuotes(text: string, { language, onUnpairedQuote }: Parameters) {
	if (QUOTES[language]) {
		const [openingQuote, closingQuote] = QUOTES[language]
		// `"one"` -> `«one»`
		// (must not preceed other regexps having a quote)
		const textWithQuotesCorrected = text.replace(/"\s*([^"]+?)\s*"/g, openingQuote + '$1' + closingQuote)
		// All quotes must be replaced in order for
		// the result to be considered likely-correct.
		// It's considered better to leave quotes not replaced
		// than replace some of them and then assume that
		// maybe others aren't screwed up as a result.
		const nonReplacedQuotesLeft = countCharacterOccurrences(textWithQuotesCorrected, '"')
		if (nonReplacedQuotesLeft === 0) {
			return textWithQuotesCorrected
		} else if (nonReplacedQuotesLeft % 2) {
			if (onUnpairedQuote) {
				onUnpairedQuote()
			}
		}
	}
	return text
}

/**
 * Counts occurrences of a character in a string.
 * Doesn't support advanced UTF-8 symbols
 * because they're longer than a single byte.
 * @param  {string} string
 * @param  {string} character
 * @return {number}
 */
function countCharacterOccurrences(string: string, character: string) {
	let occurrences = 0
	let i = 0
	while (i < string.length) {
		if (string[i] === character) {
			occurrences++
		}
		i++
	}
	return occurrences
}