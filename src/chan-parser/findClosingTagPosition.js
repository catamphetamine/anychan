export default function findClosingTagPosition(text, position, tagLevel = 0) {
	const tagPosition = text.indexOf('<', position)
	if (tagPosition >= 0) {
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
		if (tagLevel < 0) {
			return tagPosition
		}
		return findClosingTagPosition(text, tagPosition + 1, tagLevel)
	}
}