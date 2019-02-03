// A naive approach.
// Supports Russian and English.
const WORD_BOUNDARY = '[^а-яА-Яa-zA-Z]'

export default function compileFilters({
	ignoredWords,
	ignoredWordsCaseSensitive,
	ignoredPatterns,
	ignoredPatternsCaseSensitive
}) {
	const filters = {}
	// Case-insensitive words.
	// (a naive approach)
	filters.ignoredWords = {}
	for (const name of Object.keys(ignoredWords)) {
		filters.ignoredWords[name] = new RegExp(WORD_BOUNDARY + '(' + ignoredWords[name].join('|') + ')' + WORD_BOUNDARY, 'i')
	}
	// Case-sensitive words.
	// (a naive approach)
	filters.ignoredWordsCaseSensitive = {}
	for (const name of Object.keys(ignoredWordsCaseSensitive)) {
		filters.ignoredWordsCaseSensitive[name] = new RegExp(WORD_BOUNDARY + '(' + ignoredWordsCaseSensitive[name].join('|') + ')' + WORD_BOUNDARY)
	}
	// Case-insensitive patterns.
	filters.ignoredPatterns = {}
	for (const name of Object.keys(ignoredPatterns)) {
		filters.ignoredPatterns[name] = []
		for (const pattern of ignoredPatterns[name]) {
			filters.ignoredPatterns[name].push(new RegExp(pattern, 'i'))
		}
	}
	// Case-sensitive patterns.
	filters.ignoredPatternsCaseSensitive = {}
	for (const name of Object.keys(ignoredPatternsCaseSensitive)) {
		filters.ignoredPatternsCaseSensitive[name] = []
		for (const pattern of ignoredPatternsCaseSensitive[name]) {
			filters.ignoredPatternsCaseSensitive[name].push(new RegExp(pattern))
		}
	}
}