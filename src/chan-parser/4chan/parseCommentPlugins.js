import createLink from '../createLink'
import dropQuoteMarker from '../dropQuoteMarker'

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
	attributes: [
		{
			name: 'class',
			value: 'deadlink'
		}
	],
	// Won't "unescape" content (for some reason).
	correctContent: false,
	createBlock(content) {
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
	attributes: [
		{
			name: 'class',
			value: 'quote'
		}
	],
	createBlock(content) {
		return {
			type: 'inline-quote',
			content: dropQuoteMarker(content)
		}
	}
}

const parseLink = {
	tag: 'a',
	createBlock(content, util) {
		const href = util.getAttribute('href')
		if (href[0] === '#') {
			// <a href=\"#p184569592\" class=\"quotelink\">&gt;&gt;184569592</a>
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
	parseBold,
	parseUnderline,
	parseSpoiler,
	parseDeletedLink,
	parseQuote,
	parseLink
]