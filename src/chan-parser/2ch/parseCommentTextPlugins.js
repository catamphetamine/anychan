import createLink from '../createLink'

const parseNewLine = {
	tag: 'br',
	canContainChildren: false,
	createBlock() {
		return '\n'
	}
}

const parseInlineQuote = {
	tag: 'span',
	matchAttributes: 'class="unkfunc"',
	createBlock(content) {
		// `> abc` -> `abc`
		if (typeof content === 'string') {
			// If the quote contains plain text.
			content = content.replace(/^>\s*/, '')
		} else {
			// If the quote contains other blocks like bold text, etc.
			content[0] = content[0].replace(/^>\s*/, '')
		}
		return {
			type: 'inline-quote',
			content
		}
	}
}

const parseQuote = {
	tag: 'div',
	matchAttributes: 'class="quote"',
	createBlock(content) {
		return {
			type: 'inline-quote',
			content
		}
	}
}

const parseBold = {
	tag: 'strong',
	createBlock(content) {
		return {
			type: 'text',
			style: 'bold',
			content
		}
	}
}

const parseItalic = {
	tag: 'em',
	createBlock(content) {
		return {
			type: 'text',
			style: 'italic',
			content
		}
	}
}

const parseSubscript = {
	tag: 'sub',
	createBlock(content) {
		return {
			type: 'text',
			style: 'subscript',
			content
		}
	}
}

const parseSuperscript = {
	tag: 'sup',
	createBlock(content) {
		return {
			type: 'text',
			style: 'superscript',
			content
		}
	}
}

const parseStrikethrough = {
	tag: 'span',
	matchAttributes: 'class="s"',
	createBlock(content) {
		return {
			type: 'text',
			style: 'strikethrough',
			content
		}
	}
}

const parseSpoiler = {
	tag: 'span',
	matchAttributes: 'class="spoiler"',
	createBlock(content) {
		return {
			type: 'spoiler',
			content
		}
	}
}

const parseUnderline = {
	tag: 'span',
	matchAttributes: 'class="u"',
	createBlock(content) {
		return content
	}
}

const parseOverline = {
	tag: 'span',
	matchAttributes: 'class="o"',
	createBlock(content) {
		return content
	}
}

const parseLink = {
	tag: 'a',
	attributes: ['href', 'data-thread', 'data-num'],
	// Won't "unescape" content (for some reason).
	correctContent: false,
	createBlock(content, [href, threadId, postId]) {
		if (threadId) {
			const boardId = href.match(/^\/([^\/]+)/)[1]
			return {
				type: 'post-link',
				boardId,
				threadId: parseInt(threadId),
				postId: parseInt(postId),
				content: content.slice('>>'.length),
				url: `https://2ch.hk${href}`
			}
		}
		return createLink(href, content)
	}
}

export default [
	parseNewLine,
	parseInlineQuote,
	parseQuote,
	parseLink,
	parseBold,
	parseItalic,
	parseStrikethrough,
	parseUnderline,
	parseOverline,
	parseSpoiler,
	parseSubscript,
	parseSuperscript
]