import getHumanReadableLinkAddress from '../getHumanReadableLinkAddress'

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
		return {
			type: 'link',
			content: getHumanReadableLinkAddress(content),
			url: href
		}
	}
}

const parseSpan = {
	opener: 'span',
	attributes: ['style'],
	createBlock(content, [style]) {
		// style="color: red;"
		return content
	}
}

export default [
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
	parseSpoiler,
	parseSubscript,
	parseSuperscript,
	parseSpan
]