export default function findClosingTagPosition(text, position, tagLevel = 0) {
	const tagPosition = text.indexOf('<', position)
	if (tagPosition < 0) {
		return -1
	}
	// If it's a closing tag.
	if (text[tagPosition + 1] === '/') {
		tagLevel--
	} else {
		// If it's another opening tag.
		const tagEndingBracket = text.indexOf('>', tagPosition + 1)
		// If it's a self-closing tag.
		if (tagEndingBracket >= 0 && text[tagEndingBracket - 1] === '/') {
			// Don't increment `tagLevel`.
		} else {
			tagLevel++
		}
	}
	// If it's a closing tag for the root-level tag.
	if (tagLevel < 0) {
		return tagPosition
	}
	// Else, it's a closing tag for a child tag.
	// Find next closing tag.
	return findClosingTagPosition(text, tagPosition + 1, tagLevel)
}