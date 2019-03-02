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

// They have these in `/g/` for some reason.
const parseBoldLegacy = {
	tag: 'b',
	createBlock(content) {
		return {
			type: 'text',
			style: 'bold',
			content
		}
	}
}

// They have these in `/g/` for some reason.
const parseItalicLegacy = {
	tag: 'i',
	createBlock(content) {
		return {
			type: 'text',
			style: 'italic',
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

// They have these in `/g/`.
const parseCode = {
	tag: 'pre',
	attributes: [
		{
			name: 'class',
			value: 'prettyprint'
		}
	],
	createBlock(content) {
		return {
			type: 'monospace',
			// inline: true,
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

// They also have things like:
// * `<span style="color:#789922;">...</span>`
// * `<span class="fortune" style="color:#789922;">...</span>`
// * `<span style="color: red; font-size: xx-large;">...</span>`
// * `<font size="4">...</font>`
// * `<font color="red">...</font>`
// * `<img src="//static.4chan.org/image/temp/dinosaur.gif"/>`
// * `<span class="sjis">...</span>`
// * `<span style="font-size:20px;font-weight:600;line-height:120%">...</span>`
// * `<ul/>`/`<li/>`
// * `<h1/>`
// * `<blink/>`
// * `<div align="center"/>`
// * There're even `<table/>`s in "Photography"
export default [
	parseBold,
	parseBoldLegacy,
	parseItalicLegacy,
	parseUnderline,
	parseSpoiler,
	parseDeletedLink,
	parseQuote,
	parseLink,
	parseCode
]