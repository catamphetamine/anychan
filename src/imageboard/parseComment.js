import censorWords from 'webapp-frontend/src/utility/post/censorWords'

const NEW_LINE_AROUND = [
	'div',
	'section',
	'blockquote'
]

const DOUBLE_NEW_LINE_AROUND = [
	'p',
	'h1',
	'h2',
	'h3',
	'h4',
	'h5',
	'h6'
]

/**
 * Parses comment HTML.
 * Returns an array of paragraphs.
 * @param  {object} comment
 * @param  {object} options — `{ plugins, censoredWords, filterText, emojiUrl, toAbsoluteUrl, commentUrlParser }`
 * @return {any[][]}
 */
export default function parseComment(comment, options) {
	return new CommentParser(options).parse(comment)
}

class CommentParser {
	constructor(options = {}) {
		this.options = options
	}

	parse(comment) {
		// Is only used for debug output.
		this.debugRawComment = comment
		// https://developer.mozilla.org/en-US/docs/Web/API/DOMParser
		const document = new DOMParser().parseFromString(comment, 'text/html')
		let paragraph = this.parseContent(document.body.childNodes)
		if (paragraph) {
			if (typeof paragraph === 'string') {
				paragraph = [paragraph]
			}
			// Promote top-level "code" blocks to non-inline blocks.
			const hasBlockLevelRootLevelBlocks = paragraph.find(isBlockLevelRootLevelBlock)
			if (!hasBlockLevelRootLevelBlocks) {
				return [paragraph]
			}
			return moveBlockLevelRootLevelBlocksToTop(paragraph)
		}
	}

	shouldParseUsingPlugin(element, plugin) {
		if (!element.tagName) {
			return
		}
		if (element.tagName.toLowerCase() !== plugin.tag) {
			return
		}
		// `attributes` could have been implemented as an object
		// rather than an array: that would result in cleaner code
		// but at the same time also in 2x slower performance
		// of this `for of` loop (the test is at the bottom of the page).
		if (plugin.attributes) {
			for (const attribute of plugin.attributes) {
				if (!element.hasAttribute(attribute.name)) {
					return
				}
				const value = element.getAttribute(attribute.name)
				if (attribute.value instanceof RegExp) {
					if (!attribute.value.test(value)) {
						return
					}
				} else {
					if (value !== attribute.value) {
						return
					}
				}
			}
		}
		return true
	}

	parseText(text) {
		const { filterText, censoredWords } = this.options
		if (filterText) {
			text = filterText(text)
		}
		if (censoredWords) {
			return censorWords(text, censoredWords)
			// const result = filterComment(rawComment, censoredWords)
			// if (result) {
			// 	comment.hidden = true
			// 	if (result.name !== '*') {
			// 		comment.hiddenRule = result.name
			// 	}
			// }
		}
		return text
	}

	parseNode = (node) => {
		// `3` means "text node".
		if (node.nodeType === 3) {
			return this.parseText(node.textContent)
		}
		// `1` means "DOM element".
		if (node.nodeType === 1) {
			if (node.tagName.toLowerCase() === 'br') {
				return '\n'
			}
			for (const plugin of this.options.plugins) {
				if (this.shouldParseUsingPlugin(node, plugin)) {
					const content = node.childNodes.length > 0 ? this.parseContent(node.childNodes) : undefined
					if (!content && plugin.content !== false) {
						return
					}
					return plugin.createBlock(content, node, this.options)
				}
			}
		}
		return null
	}

	parseContent(childNodes) {
		childNodes = Array.from(childNodes.values())
		let content = []
		let i = 0
		while (i < childNodes.length) {
			const node = childNodes[i]
			// Special case for "\n"s added for `NEW_LINE_AROUND`
			// and `DOUBLE_NEW_LINE_AROUND` below.
			const result = node === '\n' ? '\n' : this.parseNode(node)
			if (result) {
				// An array can be returned when some words get ignored
				// and a string is transformed into an array of strings and `spoiler`s.
				// Also, for `8ch.net` line an array of `[text, '\n']` is returned.
				if (Array.isArray(result)) {
					content = content.concat(result)
				} else {
					content.push(result)
				}
			} else if (result === null) {
				console.warn('Unknown comment node type', node)
				const expandedNodes = Array.from(node.childNodes.values())
				// `1` means "DOM element".
				if (node.nodeType === 1) {
					if (NEW_LINE_AROUND.includes(node.tagName.toLowerCase())) {
						expandedNodes.unshift('\n')
						expandedNodes.push('\n')
					} else if (DOUBLE_NEW_LINE_AROUND.includes(node.tagName.toLowerCase())) {
						expandedNodes.unshift('\n')
						expandedNodes.unshift('\n')
						expandedNodes.push('\n')
						expandedNodes.push('\n')
					}
				}
				childNodes.splice(i, 1, ...expandedNodes)
				i--
			}
			i++
		}
		if (content.length === 0) {
			return
		}
		if (content.length === 1 && typeof content[0] === 'string') {
			return content[0]
		}
		return content
	}
}

function isBlockLevelRootLevelBlock(block) {
	return block.type === 'code' && !block.inline
}

function moveBlockLevelRootLevelBlocksToTop(_paragraph) {
	const paragraphs = []
	let paragraph = []
	let blockLevelBlockFound = false
	for (const part of _paragraph) {
		if (isBlockLevelRootLevelBlock(part)) {
			if (paragraph.length > 0) {
				paragraph = trimNewLinesRightSide(paragraph)
				if (blockLevelBlockFound) {
					paragraph = trimNewLinesLeftSide(paragraph)
				}
				if (paragraph.length > 0) {
					paragraphs.push(paragraph)
					paragraph = []
				}
			}
			paragraphs.push(part)
			blockLevelBlockFound = true
		} else {
			paragraph.push(part)
		}
	}
	if (paragraph.length > 0) {
		if (blockLevelBlockFound) {
			paragraph = trimNewLinesLeftSide(paragraph)
		}
		if (paragraph.length > 0) {
			paragraphs.push(paragraph)
		}
	}
	return paragraphs
}

function trimNewLinesLeftSide(paragraph) {
	while (paragraph.length > 0 && paragraph[0] === '\n') {
		paragraph = paragraph.slice(1)
	}
	return paragraph
}

function trimNewLinesRightSide(paragraph) {
	while (paragraph.length > 0 && paragraph[paragraph.length - 1] === '\n') {
		paragraph = paragraph.slice(0, paragraph.length - 1)
	}
	return paragraph
}

// `attributes` Arrays vs Objects lookup performance test.
// Arrays seem to be 2x faster than Objects.

// var object = {
//   a: 'a',
//   b: 'b',
//   c: 'c'
// }

// var array = [{
//   name: 'a',
//   value: 'a'
// }, {
//   name: 'b',
//   value: 'b'
// }, {
//   name: 'c',
//   value: 'c'
// }]

// var startedAt = Date.now()

// var i = 0
// while (i < 10000000) {
// 	for (key of Object.keys(object)) {
// 		if (key === 'c') {
// 			if (a[key] !== 'c') {
// 				break
// 			}
// 		}
// 	}
// 	i++
// }

// console.log('Object time:', Date.now() - startedAt)

// startedAt = Date.now()

// var i = 0
// while (i < 10000000) {
// 	for (element of array) {
// 		if (element.name === 'c') {
// 			if (element.value !== 'c') {
// 				break
// 			}
// 		}
// 	}
// 	i++
// }

// console.log('Array time:', Date.now() - startedAt)