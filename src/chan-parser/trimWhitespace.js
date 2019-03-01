/**
 * Trims whitespace (including newlines)
 * in the beginning and in the end.
 * `content` internals will be mutated.
 * @param  {any[][]} content
 * @return {any[][]} [result]
 */
export default function trimWhitespace(content) {
	// `content` internals will be mutated.
	// content = content.slice()
	let i = 0
	while (i < content.length) {
		const paragraph = content[i]
		// Could be an embedded video.
		// (not necessarily an array)
		if (Array.isArray(paragraph)) {
			trimLeft(paragraph)
			trimRight(paragraph)
			if (paragraph.length === 0) {
				content.splice(i, 1)
				i--
			}
		}
		i++
	}
	if (content.length > 0) {
		return content
	}
}

const WHITESPACE = /^\s+$/
const START_WHITESPACE = /^\s+/
const END_WHITESPACE = /\s+$/

function trimLeft(content) {
	let i = 0
	while (i < content.length) {
		if (typeof content[i] === 'string') {
			if (WHITESPACE.test(content[i])) {
				content.splice(i, 1)
				i--
			} else {
				content[i] = content[i].replace(START_WHITESPACE, '')
				// Stops at the first non-new-line.
				return false
			}
		} else {
			// It's assumed here that if a string `content` is set
			// then it's not empty and is trimmed.
			if (!Array.isArray(content[i].content)) {
				return false
			}
			const canProceed = trimLeft(content[i].content)
			if (canProceed === false) {
				return false
			}
		}
		i++
	}
}

function trimRight(content) {
	let i = content.length - 1
	while (i >= 0) {
		if (typeof content[i] === 'string') {
			if (WHITESPACE.test(content[i])) {
				content.splice(i, 1)
			} else {
				content[i] = content[i].replace(END_WHITESPACE, '')
				// Stops at the first non-new-line.
				return false
			}
		} else {
			// It's assumed here that if a string `content` is set
			// then it's not empty and is trimmed.
			if (!Array.isArray(content[i].content)) {
				return false
			}
			const canProceed = trimRight(content[i].content)
			if (canProceed === false) {
				return false
			}
		}
		i--
	}
}