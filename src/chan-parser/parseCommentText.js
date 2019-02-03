import unescapeContent from './unescapeContent'
import findClosingTagPosition from './findClosingTagPosition'
import getHumanReadableLinkAddress from './getHumanReadableLinkAddress'

// Returns an array of paragraphs.
export default function parseCommentText(comment, options = {}) {
	return new CommentTextParser(options).parse(comment)
}

class CommentTextParser {
	constructor(options = {}) {
		this.options = options
	}

	parse(comment) {
		// // Replace inline quotes with block quotes.
		// // Converts `abc<br><span class="unkfunc">> ccc</span><br>def`
		// // to `abc<div class="quote">ccc</div>def`.
		// comment = comment.replace(
		// 	/(?:<br>)?<span class="unkfunc">&gt;\s*(.*?)<\/span>(?:<br>)?/g,
		// 	'<div class="quote">$1</div>'
		// )
		// Parse into paragraphs.
		if (this.options.parseParagraphs) {
			const paragraphs = comment.split(/<br>(?:<br>)+/)
			return paragraphs.filter(_ => _).map(this.parseParagraph)
		}
		// Remove excessive `<br>`s.
		comment = comment
			.replace(/<br>(<br>)+/g, '<br><br>')
			.replace(/^<br>(<br>)?/, '')
			.replace(/<br>(<br>)?$/, '')
		return [this.parseParagraph(comment)]
	}

	// Returns an array of inline elements.
	// Some of such inline elements may be empty strings
	// which are later filtered by `parseCommentText()`.
	parseParagraph = (text) => {
		// Normalize `<br>`s so that they don't break parsing (`findClosingTagPosition()`).
		text = text.replace(/<br>/g, '<br/>')
		// text = removeInvalidClosingTags(text)
		for (const plugin of PARSE_COMMENT_TEXT_PLUGINS) {
			const parsed = this.parseHtmlTag(text, plugin)
			if (parsed) {
				return parsed.filter(_ => _)
				// if (Array.isArray(parsed)) {
				// 	return parsed.filter(_ => _)
				// }
				// // Invalid HTML markup was corrected.
				// return this.parseParagraph(parsed)
			}
		}
		// Generic text.
		return [this.correctGrammar(unescapeContent(text))]
	}

	parseHtmlTag(text, { opener, attributes, canContainChildren, correctContent, createBlock }) {
		const firstTagStartsAt = text.indexOf('<')
		if (firstTagStartsAt < 0) {
			return
		}
		// First parse outer tags, then inner tags.
		if (text.indexOf('<' + opener) !== firstTagStartsAt) {
			return
		}
		const startsAt = text.indexOf('<' + opener)
		if (startsAt >= 0) {
			const openerEndsAt = text.indexOf('>', startsAt + '<'.length)
			// Parse content.
			let endsAt
			let content
			if (canContainChildren !== false) {
				const contentStartsAt = text.indexOf('>', startsAt + 1) + '>'.length
				const contentEndsAt = findClosingTagPosition(text, contentStartsAt)
				// Invalid HTML markup.
				// Remove the invalid HTML tag.
				if (!contentEndsAt) {
					// return text.slice(contentStartsAt)
					console.error('Invalid HTML markup', text)
					return
				}
				endsAt = text.indexOf('>', contentEndsAt) + '>'.length
				content = text.slice(contentStartsAt, contentEndsAt)
				// If there are nested tags then maybe parse them.
				// Post links seem to contain unescaped `>>`s which is a bug.
				if (content.indexOf('<') >= 0) {
					content = this.parseParagraph(content)
				} else {
					content = correctContent === false ? unescapeContent(content) : this.correctGrammar(unescapeContent(content))
				}
			} else {
				endsAt = text.indexOf('>', startsAt) + '>'.length
			}
			// Parse attributes.
			const _attributes = []
			if (attributes) {
				const markup = text.slice(startsAt, openerEndsAt + 1)
				for (const attribute of attributes) {
					const attributeDefinitionStartsAt = markup.indexOf(`${attribute}="`)
					if (attributeDefinitionStartsAt < 0) {
						_attributes.push()
						continue
					}
					const attributeStartsAt = attributeDefinitionStartsAt + `${attribute}="`.length
					const attributeEndsAt = markup.indexOf('"', attributeStartsAt)
					_attributes.push(
						unescapeContent(
							markup.slice(attributeStartsAt, attributeEndsAt)
						)
					)
				}
			}
			return [].concat(
				this.parseParagraph(text.slice(0, startsAt)),
				createBlock(content, _attributes),
				this.parseParagraph(text.slice(endsAt))
			)
		}
	}

	correctGrammar(text) {
		if (this.options.correctGrammar) {
			return this.options.correctGrammar(text)
		}
		return text
	}
}

const parseParagraph = {
	opener: 'p',
	createBlock(content) {
		return content
	}
}

const parseNewLine = {
	opener: 'br/>',
	canContainChildren: false,
	createBlock() {
		return '\n'
	}
}

const parseInlineQuote = {
	opener: 'span class="unkfunc">',
	createBlock(content) {
		// `> abc` -> `abc`
		if (typeof content === 'string') {
			content = content.replace(/^>\s*/, '')
		} else {
			content[0] = content[0].replace(/^>\s*/, '')
		}
		return {
			type: 'inline-quote',
			content
		}
	}
}

const parseQuote = {
	opener: 'div class="quote">',
	createBlock(content) {
		return {
			type: 'inline-quote',
			content
		}
	}
}

const parseBold = {
	opener: 'strong',
	createBlock(content) {
		return {
			type: 'text',
			style: 'bold',
			content
		}
	}
}

const parseItalic = {
	opener: 'em',
	createBlock(content) {
		return {
			type: 'text',
			style: 'italic',
			content
		}
	}
}

const parseSubscript = {
	opener: 'sub',
	createBlock(content) {
		return {
			type: 'text',
			style: 'subscript',
			content
		}
	}
}

const parseSuperscript = {
	opener: 'sup',
	createBlock(content) {
		return {
			type: 'text',
			style: 'superscript',
			content
		}
	}
}

const parseStrikethrough = {
	opener: 'span class="s"',
	createBlock(content) {
		return {
			type: 'text',
			style: 'strikethrough',
			content
		}
	}
}

const parseSpoiler = {
	opener: 'span class="spoiler"',
	createBlock(content) {
		return {
			type: 'spoiler',
			content
		}
	}
}

const parseUnderline = {
	opener: 'span class="u"',
	createBlock(content) {
		return content
	}
}

const parseOverline = {
	opener: 'span class="o"',
	createBlock(content) {
		return content
	}
}

const parseLink = {
	opener: 'a ',
	attributes: ['href', 'data-thread', 'data-num'],
	correctContent: false,
	createBlock(content, [href, threadId, postId]) {
		if (threadId) {
			const boardId = href.match(/^\/([^\/]+)/)[1]
			return {
				type: 'post-link',
				boardId,
				threadId,
				postId,
				content: content.slice('>>'.length),
				url: `https://2ch.hk${href}`
			}
		}
		return {
			type: 'link',
			content: getHumanReadableLinkAddress(content),
			url: href
		}
	}
}

const parseColoredText = {
	opener: 'span style="color:',
	createBlock(content) {
		return content
	}
}

const PARSE_COMMENT_TEXT_PLUGINS = [
	parseParagraph,
	parseNewLine,
	parseInlineQuote,
	parseQuote,
	parseLink,
	parseBold,
	parseItalic,
	parseStrikethrough,
	parseUnderline,
	parseOverline,
	parseColoredText,
	parseSpoiler,
	parseSubscript,
	parseSuperscript
]

// function removeInvalidClosingTags(text) {
// 	const firstTagStartsAt = text.indexOf('<')
// 	if (text[firstTagStartsAt + 1] === '/') {
// 		const firstTagEndsAt = text.indexOf('>', firstTagStartsAt)
// 		return removeInvalidClosingTags(text.slice(firstTagEndsAt >= 0 ? firstTagEndsAt + 1 : firstTagStartsAt + 1))
// 	}
// 	return text
// }