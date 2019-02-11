import createLink from '../createLink'

const parseNewLine = {
	tag: 'br',
	canContainChildren: false,
	createBlock() {
		return '\n'
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

const parseUnderline = {
	tag: 'u',
	createBlock(content) {
		return {
			type: 'text',
			style: 'underline',
			content
		}
	}
}

const parseSpoiler = {
	tag: 's',
	createBlock(content) {
		return {
			type: 'spoiler',
			content
		}
	}
}

const parseDeletedLink = {
	tag: 'span',
	matchAttributes: 'class="deadlink"',
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
	tag: 'span',
	matchAttributes: 'class="quote"',
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
	tag: 'a',
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
			return createLink(href, content.slice('//'.length))
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
			return createLink(href, content)
		} else {
			// "https://boards.4chan.org/wsr/"
			return createLink(href, content)
		}
	}
}

export default [
	parseNewLine,
	parseBold,
	parseUnderline,
	parseSpoiler,
	parseDeletedLink,
	parseQuote,
	parseLink
]