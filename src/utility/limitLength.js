import test from './limitLength.test'

const END_OF_SENTENCE_PUNCTUATION = ['.', '?', '!']

/**
 * Trims a string if it exceeds the maximum length.
 * Trims at sentence endings when available,
 * trims as-is otherwise (appending an ellipsis).
 * @param  {string} string
 * @param  {number} maxLength
 * @return {string}
 */
export default function limitLength(string, maxLength) {
	if (string.length <= maxLength) {
		return string
	}
	string = string.slice(0, maxLength)
	// Trim by end of sentence (if available).
	let lastSentenceEndsAtLongest
	let lastSentenceEndsAtLongestPunctuation
	for (const puctuation of END_OF_SENTENCE_PUNCTUATION) {
		const lastSentenceEndsAt = string.lastIndexOf(puctuation + ' ')
		if (lastSentenceEndsAt >= 0) {
			if (!lastSentenceEndsAtLongest || lastSentenceEndsAt > lastSentenceEndsAtLongest) {
				lastSentenceEndsAtLongest = lastSentenceEndsAt
				lastSentenceEndsAtLongestPunctuation = puctuation
			}
		}
	}
	if (lastSentenceEndsAtLongest) {
		return string.slice(0, lastSentenceEndsAtLongest + lastSentenceEndsAtLongestPunctuation.length)
	}
	// Trim by end of word (if available).
	const lastWordEndsAt = string.lastIndexOf(' ')
	if (lastWordEndsAt >= 0) {
		return string.slice(0, lastWordEndsAt) + ' ' + '…'
	}
	// Simple trim.
	return string + '…'
}

test(limitLength)