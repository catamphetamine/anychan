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
		for (const word of ignoredWords) {
			// `name` could be a word list name.
			filters.push({
				name: '*',
				regexp: new RegExp(word, 'i')
			})
		}
	}
	// Case-sensitive words.
	// (a naive approach)
	if (ignoredWordsCaseSensitive) {
		for (const word of ignoredWordsCaseSensitive) {
			filters.push({
				// `name` could be a word list name.
				name: '*',
				regexp: new RegExp(word)
			})
		}
	}
	// Case-insensitive patterns.
	if (ignoredPatterns) {
		for (const pattern of ignoredPatterns) {
			filters.push({
				// `name` could be a pattern list name.
				name: '*',
				regexp: new RegExp(pattern, 'i')
			})
		}
	}
	// Case-sensitive patterns.
	if (ignoredPatternsCaseSensitive) {
		for (const pattern of ignoredPatternsCaseSensitive) {
			filters.push({
				// `name` could be a pattern list name.
				name: '*',
				regexp: new RegExp(pattern)
			})
		}
	}
	return filters
}