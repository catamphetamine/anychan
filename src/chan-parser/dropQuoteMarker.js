// `> abc` -> `abc`.
// A quote can contain other blocks like bold text, etc.
export default function dropQuoteMarker(content) {
	if (typeof content === 'string') {
		return dropQuoteMarkerText(content)
	}
	let parts = content
	while (true) {
		if (typeof parts[0] === 'string') {
			parts[0] = dropQuoteMarkerText(parts[0])
			break
		}
		if (typeof parts[0].content === 'string') {
			parts[0].content = dropQuoteMarkerText(parts[0].content)
			break
		}
		parts = parts[0].content
	}
	return content
}

function dropQuoteMarkerText(text) {
	return text.replace(/^>\s*/, '')
}