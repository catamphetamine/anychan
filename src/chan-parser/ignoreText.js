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
	let result
	const preText = text.slice(0, match.index)
	const preTextAfterIgnore = ignore(preText, filters, filterIndex + 1)
	if (preTextAfterIgnore) {
		result = preTextAfterIgnore
	} else {
		result = [preText]
	}
	result.push({
		type: 'spoiler',
		rule: filter.name,
		content: match[0]
	})
	const postText = text.slice(match.index + match[0].length)
	const postTextAfterIgnore = ignore(postText, filters, filterIndex + 1)
	if (postTextAfterIgnore) {
		result = result.concat(postTextAfterIgnore)
	} else {
		result.push(postText)
	}
	return result
}