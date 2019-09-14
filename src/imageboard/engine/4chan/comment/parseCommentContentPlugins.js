import { getContentText } from 'webapp-frontend/src/utility/post/getPostText'

import createLink from '../../../utility/createLink'
import dropQuoteMarker from '../../../dropQuoteMarker'
import parsePostLink from '../../../parsePostLink'

export const bold = {
	tag: 'strong',
	createBlock(content) {
		return {
			type: 'text',
			style: 'bold',
			content
		}
	}
}

export const italic = {
	tag: 'em',
	createBlock(content) {
		return {
			type: 'text',
			style: 'italic',
			content
		}
	}
}

export const underline = {
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
export const code = {
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

export const quote = {
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

export const link = {
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