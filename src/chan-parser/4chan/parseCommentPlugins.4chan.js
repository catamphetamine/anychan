import createLink from 'webapp-frontend/src/utility/post/createLink'
import dropQuoteMarker from '../dropQuoteMarker'

export const parseBold = {
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

// There seems to be no `<em>`s on 4chan.org.
// Added this plugin just in case (in case they add `<em>`s in some future).
export const parseItalic = {
	tag: 'em',
	createBlock(content) {
		return {
			type: 'text',
			style: 'italic',
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

export const parseUnderline = {
	tag: 'u',
	createBlock(content) {
		return {
			type: 'text',
			style: 'underline',
			content
		}
	}
}

// They have code tags in `/g/`.
export const parseCode = {
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

// 4chan.org spoiler.
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

// 4chan.org quote.
export const parseQuote = {
	tag: 'span',
	attributes: [
		{
			name: 'class',
			value: 'quote'
		}
	],
	createBlock(content) {
		content = dropQuoteMarker(content)
		if (content) {
			return {
				type: 'inline-quote',
				content
			}
		}
	}
}

export const parseLink = {
	tag: 'a',
	createBlock(content, util, { commentUrlRegExp }) {
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
			const match = href.match(commentUrlRegExp)
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

// "ASCII art" or "ShiftJIS art".
const parseAsciiOrShiftJISArt = {
	tag: 'span',
	attributes: [
		{
			name: 'class',
			value: 'sjis'
		}
	],
	createBlock(content) {
		return {
			type: 'text',
			style: 'ascii-shift-jis-art',
			content
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
// * `<span style="font-size:20px;font-weight:600;line-height:120%">...</span>`
// * `<ul/>`/`<li/>`
// * `<h1/>`
// * `<blink/>`
// * `<div align="center"/>`
// * There're even `<table/>`s in "Photography"
export default [
	parseBold,
	parseBoldLegacy,
	parseItalic,
	parseItalicLegacy,
	parseUnderline,
	parseSpoiler,
	parseDeletedLink,
	parseQuote,
	parseLink,
	parseCode,
	parseAsciiOrShiftJISArt
]