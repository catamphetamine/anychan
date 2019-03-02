export default function compileFilters({
	ignoredWords,
	ignoredWordsCaseSensitive,
	ignoredPatterns,
	ignoredPatternsCaseSensitive
}) {
	const filters = []
	// Case-insensitive words.
	// (a naive approach)
	if (ignoredWords) {
		for (const name of Object.keys(ignoredWords)) {
			for (const word of ignoredWords[name]) {
				filters.push({
					name,
					regexp: new RegExp(word, 'i')
				})
			}
		}
	}
	// Case-sensitive words.
	// (a naive approach)
	if (ignoredWordsCaseSensitive) {
		for (const name of Object.keys(ignoredWordsCaseSensitive)) {
			for (const word of ignoredWordsCaseSensitive[name]) {
				filters.push({
					name,
					regexp: new RegExp(word)
				})
			}
		}
	}
	// Case-insensitive patterns.
	if (ignoredPatterns) {
		for (const name of Object.keys(ignoredPatterns)) {
			for (const pattern of ignoredPatterns[name]) {
				filters.push({
					name,
					regexp: new RegExp(pattern, 'i')
				})
			}
		}
	}
	// Case-sensitive patterns.
	if (ignoredPatternsCaseSensitive) {
		for (const name of Object.keys(ignoredPatternsCaseSensitive)) {
			for (const pattern of ignoredPatternsCaseSensitive[name]) {
				filters.push({
					name,
					regexp: new RegExp(pattern)
				})
			}
		}
	}
	return filters
}