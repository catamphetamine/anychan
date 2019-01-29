import test from './correctQuotes.test'

/**
 * Intelligently replaces single quotes (`""`) with paired ones (`«»`).
 * @param  {string} text
 * @return {string}
 */
export default function correctQuotes(text) {
	// `"one"` -> `«one»`
	// (must not preceed other regexps having a quote)
	const quotesCorrected = text.replace(/"\s*([^"]+?)\s*"/g, '«$1»')
	// All quotes must be replaced in order for
	// the result to be considered likely-correct.
	// It's considered better to leave quotes not replaced
	// than replace some of them and then assume that
	// maybe others aren't screwed up as a result.
	if (countCharacterOccurrences(quotesCorrected, '"') === 0) {
		return quotesCorrected
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
function countCharacterOccurrences(string, character) {
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

test(correctQuotes)