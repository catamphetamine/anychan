import createLink from '../createLink'
import dropQuoteMarker from '../dropQuoteMarker'

const parseInlineQuote = {
	tag: 'span',
	attributes: [
		{
			name: 'class',
			value: 'unkfunc'
		}
	],
	createBlock(content) {
		return {
			type: 'inline-quote',
			content: dropQuoteMarker(content)
		}
	}
}

const parseQuote = {
	tag: 'div',
	attributes: [
		{
			name: 'class',
			value: 'quote'
		}
	],
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
	attributes: [
		{
			name: 'class',
			value: 's'
		}
	],
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
	attributes: [
		{
			name: 'class',
			value: 'spoiler'
		}
	],
	createBlock(content) {
		return {
			type: 'spoiler',
			content
		}
	}
}

const parseUnderline = {
	tag: 'span',
	attributes: [
		{
			name: 'class',
			value: 'u'
		}
	],
	createBlock(content) {
		return {
			type: 'text',
			style: 'underline',
			content
		}
	}
}

const parseOverline = {
	tag: 'span',
	attributes: [
		{
			name: 'class',
			value: 'o'
		}
	],
	createBlock(content) {
		return {
			type: 'text',
			style: 'overline',
			content
		}
	}
}

const parseLink = {
	tag: 'a',
	// // Won't "unescape" content (for some reason).
	// correctContent: false,
	createBlock(content, util) {
		const href = util.getAttribute('href')
		if (util.hasAttribute('data-thread')) {
			const threadId = util.getAttribute('data-thread')
			const postId = util.getAttribute('data-num')
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