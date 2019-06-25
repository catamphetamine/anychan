import createLink from 'webapp-frontend/src/utility/post/createLink'
import dropQuoteMarker from '../dropQuoteMarker'
import parsePostLink from '../parsePostLink'

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

export const parseStrikethrough = {
	tag: 's',
	createBlock(content) {
		return {
			type: 'text',
			style: 'strikethrough',
			content
		}
	}
}

export const parseSpoiler = {
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

export const parseQuote = {
	tag: 'span',
	attributes: [
		{
			name: 'class',
			value: 'greenText'
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
		const className = util.getAttribute('class')
		const href = util.getAttribute('href')
		if (className === 'quoteLink') {
			const postLink = parsePostLink(href, { commentUrlRegExp })
			return {
				type: 'post-link',
				boardId: postLink.boardId || null, // Will be set later in comment post-processing.
				threadId: postLink.threadId || null, // Will be set later in comment post-processing.
				postId: postLink.postId,
				content: content.slice('>>'.length),
				url: null // Will be set later in comment post-processing.
			}
		} else {
			// "https://google.de/"
			return createLink(href, content)
		}
	}
}

export default [
	parseBold,
	parseItalic,
	parseUnderline,
	parseSpoiler,
	parseQuote,
	parseLink
]