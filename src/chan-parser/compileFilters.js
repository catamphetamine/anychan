export default function compileFilters(filters, language) {
	return filters.reduce((all, filter) => all.concat(compileFilter(filter, language)), [])
}

function compileFilter(filter, language, includesWordStart, includesWordEnd) {
	if (includesWordStart === undefined && filter[0] === '^') {
		filter = filter.slice('^'.length)
		return [].concat(
			compileFilter('^' + filter, language, false, includesWordEnd),
			compileFilter(getNonLetter(language) + filter, language, true, includesWordEnd)
		)
	}
	if (includesWordEnd === undefined && filter[filter.length - 1] === '$') {
		filter = filter.slice(0, filter.length - '$'.length)
		return [].concat(
			compileFilter(filter + '$', language, includesWordStart, false),
			compileFilter(filter + getNonLetter(language), language, includesWordStart, true)
		)
	}
	// Replace letters.
	filter = filter.replace(/\./g, getLetter(language))
	return {
		includesWordStart,
		includesWordEnd,
		regexp: new RegExp(filter, 'i')
	}
}

function getLetter(language) {
	switch (language) {
		case 'en':
			return '[a-z]'
		case 'ru':
			return '[а-яё]'
		default:
			throw new Error(`Unknown language: ${language}`)
	}
}

function getNonLetter(language) {
	switch (language) {
		case 'en':
			return '[^a-z]'
		case 'ru':
			return '[^а-яё]'
		default:
			throw new Error(`Unknown language: ${language}`)
	}
}