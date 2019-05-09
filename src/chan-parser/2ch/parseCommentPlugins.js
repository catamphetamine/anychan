import createLink from 'webapp-frontend/src/utility/post/createLink'
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
		content = dropQuoteMarker(content)
		if (content) {
			return {
				type: 'inline-quote',
				content
			}
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

// There's `<b>` in a pinned index post in `/sn/`, for example.
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

// There seems to be no `<i>`s on 2ch.hk.
// Still some "advanced" users (like moderators) may potentially
// use it in their "advanced" custom markup (like pinned index posts).
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

// Sometimes moderators use direct HTML markup in opening posts.
const parseUnderlineTag = {
	tag: 'u',
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

// There's some `style` in a pinned index post in `/sn/`, for example.
const parseStyle = {
	tag: 'style',
	createBlock() {
		return
	}
}

// There's some `script` in a pinned index post in `/sn/`, for example.
const parseScript = {
	tag: 'script',
	createBlock() {
		return
	}
}

// // Don't know what's this for.
// // <span class="thanks-abu" style="color: red;">Абу благословил этот пост.</span>
// const parseThanksAbu = {
// 	tag: 'span',
// 	attributes: [
// 		{
// 			name: 'class',
// 			value: 'thanks-abu'
// 		}
// 	],
// 	createBlock() {
// 		return
// 	}
// }

export default [
	parseInlineQuote,
	parseQuote,
	parseLink,
	parseBold,
	parseBoldLegacy,
	parseItalic,
	parseItalicLegacy,
	parseStrikethrough,
	parseUnderline,
	parseUnderlineTag,
	parseOverline,
	parseSpoiler,
	parseSubscript,
	parseSuperscript,
	parseStyle,
	parseScript
]