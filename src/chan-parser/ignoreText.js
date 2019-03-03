export default function ignoreText(text, filters) {
	return ignore(text, filters) || text
}

function ignore(text, filters, filterIndex = 0) {
	if (filterIndex === filters.length) {
		return
	}
	const filter = filters[filterIndex]
	const match = filter.regexp.exec(text)
	if (!match) {
		return ignore(text, filters, filterIndex + 1)
	}
	let startIndex = match.index
	let matchedText = match[0]
	let endIndex = startIndex + matchedText.length
	if (filter.includesWordStart) {
		startIndex++
		matchedText = matchedText.slice(1)
	}
	if (filter.includesWordEnd) {
		endIndex--
		matchedText = matchedText.slice(0, matchedText.length - 1)
	}
	let result
	const preText = text.slice(0, startIndex)
	const preTextAfterIgnore = ignore(preText, filters, filterIndex + 1)
	if (preTextAfterIgnore) {
		result = preTextAfterIgnore
	} else if (preText) {
		result = [preText]
	} else {
		result = []
	}
	result.push({
		type: 'spoiler',
		censored: true,
		content: matchedText
	})
	const postText = text.slice(startIndex + matchedText.length)
	const postTextAfterIgnore = ignore(postText, filters, filterIndex + 1)
	if (postTextAfterIgnore) {
		result = result.concat(postTextAfterIgnore)
	} else if (postText) {
		result.push(postText)
	}
	return result
}