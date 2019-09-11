import { getContentText } from 'webapp-frontend/src/utility/post/getPostText'

import createLink from '../../../utility/createLink'
import dropQuoteMarker from '../../../dropQuoteMarker'
import parsePostLink from '../../../parsePostLink'

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
			type: 'code',
			// inline: true,
			content: content && getContentText(content)
		}
	}
}

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
				type: 'quote',
				content
			}
		}
	}
}

export const parseLink = {
	tag: 'a',
	createBlock(content, util, { commentUrlParser }) {
		const href = util.getAttribute('href')
		const postLink = parsePostLink(href, { commentUrlParser })
		if (postLink) {
			return {
				type: 'post-link',
				boardId: postLink.boardId || null, // Will be set later in comment post-processing.
				threadId: postLink.threadId || null, // Will be set later in comment post-processing.
				postId: postLink.postId,
				content: content.slice('>>'.length),
				url: null // Will be set later in comment post-processing.
			}
		}
		if (href[0] === '/') {
			if (href[1] === '/') {
				// "//boards.4chan.org/wsr/"
				return createLink(href, content.slice('//'.length))
			} else {
				// "/r/"
				return createLink(href, content)
			}
		} else {
			// "https://boards.4chan.org/wsr/"
			return createLink(href, content)
		}
	}
}

export default [
	parseBold,
	parseItalic,
	parseUnderline,
	parseCode,
	parseQuote,
	parseLink
]