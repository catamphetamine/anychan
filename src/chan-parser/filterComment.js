/**
 * Returns an object with reason if the comment doesn't pass the filter.
 * @param  {string} comment — Comment HTML
 * @param  {object} filters — Compiled filters
 * @return {object} [reason] `{ name }`
 */
export default function filter(comment, {
	ignoredWords,
	ignoredWordsCaseSensitive,
	ignoredPatterns,
	ignoredPatternsCaseSensitive
}) {
	// Case-insensitive words.
	// (a naive approach)
	for (const name of Object.keys(ignoredWords)) {
		if (ignoredWords[name].test(comment)) {
			return {
				name
			}
		}
	}
	// Case-sensitive words.
	// (a naive approach)
	for (const name of Object.keys(ignoredWordsCaseSensitive)) {
		if (ignoredWordsCaseSensitive[name].test(comment)) {
			return {
				name
			}
		}
	}
	// Case-insensitive patterns.
	for (const name of Object.keys(ignoredPatterns)) {
		for (const pattern of ignoredPatterns[name]) {
			if (pattern.test(comment)) {
				return {
					name
				}
			}
		}
	}
	// Case-sensitive patterns.
	for (const name of Object.keys(ignoredPatternsCaseSensitive)) {
		for (const pattern of ignoredPatternsCaseSensitive[name]) {
			if (pattern.test(comment)) {
				return {
					name
				}
			}
		}
	}
}