import getHumanReadableLinkAddress from '../getHumanReadableLinkAddress'

const parseNewLine = {
	opener: 'br/>',
	canContainChildren: false,
	createBlock() {
		return '\n'
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

const parseParagraph = {
	opener: 'p>',
	createBlock(content) {
		// `\n` doesn't actually add a new line.
		// `<p/>` isn't an inline element.
		// If it was parsed it could be parsed in `parseCommentText`
		// when `content` can be split into paragraphs.
		return content + '\n'
	}
}

const parseStyledParagraph = {
	opener: 'p ',
	createBlock(content, [style]) {
		// style="font-weight: bold; font-size: 12pt; color: red;"
		//
		// `\n` doesn't actually add a new line.
		// `<p/>` isn't an inline element.
		// If it was parsed it could be parsed in `parseCommentText`
		// when `content` can be split into paragraphs.
		return content + '\n'
	}
}

const parseColoredText = {
	opener: 'b ',
	createBlock(content, [style]) {
		return content
		// let color
		// const match = style.match(/^color:[^;]+/)
		// if (match) {
		// 	color = match[1]
		// }
		// return {
		// 	type: 'text',
		// 	color,
		// 	content
		// }
	}
}

const parseUnderline = {
	opener: 'u>',
	createBlock(content) {
		return {
			type: 'text',
			style: 'underline',
			content
		}
	}
}

const parseSpoiler = {
	opener: 's>',
	createBlock(content) {
		return {
			type: 'spoiler',
			content
		}
	}
}

const parseDeletedLink = {
	opener: 'span class="deadlink"',
	// Won't "unescape" content (for some reason).
	correctContent: false,
	createBlock(content, [href, threadId, postId]) {
		content = content.slice('>>'.length)
		return {
			type: 'post-link',
			boardId: null, // Will be set later in comment post-processing.
			threadId: null, // Will be set later in comment post-processing.
			postId: parseInt(content),
			content,
			url: null // Will be set later in comment post-processing.
		}
	}
}

const parseQuote = {
	opener: 'span class="quote"',
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

const parseLink = {
	opener: 'a ',
	attributes: ['href'],
	// Won't "unescape" content (for some reason).
	correctContent: false,
	createBlock(content, [href]) {
		if (href[0] === '#') {
			// "#p184154302"
			const postId = parseInt(href.slice('#p'.length))
			return {
				type: 'post-link',
				boardId: null, // Will be set later in comment post-processing.
				threadId: null, // Will be set later in comment post-processing.
				postId,
				content: content.slice('>>'.length),
				url: null // Will be set later in comment post-processing.
			}
		} else if (href[0] === '/' && href[1] === '/') {
			// "//boards.4chan.org/wsr/"
			return {
				type: 'link',
				content: content.slice('//'.length),
				url: href
			}
		} else if (href[0] === '/') {
			// "/a/thread/184064641#p184154285"
			const match = href.match(/^\/([^\/]+)\/thread\/(\d+)#p(\d+)/)
			if (match) {
				return {
					type: 'post-link',
					boardId: match[1],
					threadId: parseInt(match[2]),
					postId: parseInt(match[3]),
					content: content.slice('>>'.length),
					url: null // Will be set later in comment post-processing.
				}
			}
			// "/r/"
			return {
				type: 'link',
				content: getHumanReadableLinkAddress(content),
				url: href
			}
		} else {
			// "https://boards.4chan.org/wsr/"
			return {
				type: 'link',
				content: getHumanReadableLinkAddress(content),
				url: href
			}
		}
	}
}

export default [
	parseNewLine,
	parseBold,
	parseUnderline,
	parseColoredText,
	parseParagraph,
	parseStyledParagraph,
	parseSpoiler,
	parseDeletedLink,
	parseQuote,
	parseLink
]