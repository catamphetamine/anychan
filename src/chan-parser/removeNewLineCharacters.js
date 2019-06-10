/**
 * Sometimes chan messages HTML contains things like "\\n" or "\\r\\n".
 * @param {any} content — Post `content`
 */
export default function removeNewLineCharacters(content) {
	for (const paragraph of content) {
		if (Array.isArray(paragraph)) {
			let i = 0
			while (i < paragraph.length) {
				_removeNewLineCharacters(paragraph, i)
				i++
			}
		}
	}
}

function _removeNewLineCharacters(parent, index) {
	const part = _get(parent, index)
	// Post content can be empty.
	// Or maybe even post part's content.
	if (!part) {
		return
	}
	if (Array.isArray(part)) {
		let i = 0
		for (const subpart of part) {
			_removeNewLineCharacters(part, i)
			i++
		}
		return
	}
	if (typeof part === 'string') {
		_set(parent, index, part.replace(/(\\r)?\\n/g, ''))
		return
	}
	// Recurse into post parts.
	return _removeNewLineCharacters(part)
}

function _get(parent, index) {
	if (index === undefined) {
		return parent.content
	} else {
		return parent[index]
	}
}

function _set(parent, index, value) {
	if (index === undefined) {
		parent.content = value
	} else {
		parent[index] = value
	}
}