// `> abc` -> `abc`.
// A quote can contain other blocks like bold text, etc.
export default function dropQuoteMarker(content, character = '>', isRoot = true) {
	if (Array.isArray(content)) {
		const result = dropQuoteMarker(content[0], character, false)
		if (result) {
			content[0] = result
			return content
		} else if (content.length > 1) {
			return normalizeContent(content.slice(1), isRoot)
		} else {
			return
		}
	}
	if (typeof content === 'string') {
		const text = dropQuoteMarkerText(content, character)
		if (!text) {
			return
		}
		return text
	}
	if (!content.content) {
		console.error('".content" is missing for post part:')
		console.error(content)
		return
	}
	const result = dropQuoteMarker(content.content, character, false)
	if (result) {
		content.content = result
		return content
	}
}

function dropQuoteMarkerText(text, character) {
	return text.replace(new RegExp(`^${character}\\s*`), '')
}

function normalizeContent(content, isRoot) {
	if (!isRoot) {
		if (Array.isArray(content) && content.length === 1 && typeof content[0] === 'string') {
			return content[0]
		}
	}
	return content
}