export default function findClosingTagPosition(text, position, tagLevel = 0) {
	const tagPosition = text.indexOf('<', position)
	if (tagPosition >= 0) {
		// If it's a closing tag.
		if (text[tagPosition + 1] === '/') {
			tagLevel--
		} else {
			const tagEndingBracket = text.indexOf('>', tagPosition + 1)
			if (tagEndingBracket >= 0 && text[tagEndingBracket - 1] === '/') {
				//
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
}