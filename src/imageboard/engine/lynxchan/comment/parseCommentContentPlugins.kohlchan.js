import createLink from '../../../utility/createLink'
import dropQuoteMarker from '../../../dropQuoteMarker'
import parsePostLink from '../../../parsePostLink'

import PARSE_COMMENT_CONTENT_PLUGINS from './parseCommentContentPlugins'

// Since May 28th, 2019 `kohlchan.net` has been migrated from `vichan` to `lynxchan`.
// The old messages still have the old markup.
import LEGACY_MARKUP_PLUGINS from '../../4chan/comment/parseCommentContentPlugins.kohlchan'

const EMOTE_ID_REG_EXP = /^\/\.static\/images\/([^/]+)\.png$/

const emoji = {
	tag: 'img',
	attributes: [
		{
			name: 'class',
			value: /^emote\s?/
		}
	],
	// Without `content: false` the plugin wouldn't work
	// because empty DOM elements are ignored.
	content: false,
	createBlock(content, util, { emojiUrl, toAbsoluteUrl }) {
		const url = util.getAttribute('src')
		// "/.static/images/chen.png" -> "chen"
		const match = url.match(EMOTE_ID_REG_EXP)
		return {
			type: 'emoji',
			name: match ? match[1] : 'emoji',
			url: toAbsoluteUrl(emojiUrl ? emojiUrl.replace('{url}', url) : url)
		}
	}
}

// `highlightlink` is for old `kohlchan.net` links.
// (before it moved to `lynxchan` on May 2019)
// `quoteLink` if for new `kohlchan.net` links.
// Perhaps they somehow migrated the old posts
// and didn't insert the correct CSS class name.
// The "legacy" markup is also different.
// Sometimes it's:
// `<a onclick="highlightReply('32', event);" href="/a/res/24.html#32">>>32</a>`
// Sometimes it's:
// `<a class="highlightlink" related="297" href="/a/res/297.html#297">>>297</a>`
const quoteLinkLegacy1 = {
	tag: 'a',
	attributes: [{
		name: 'onclick',
		value: /^highlightReply/
	}],
	createBlock: createPostLink
}
const quoteLinkLegacy2 = {
	tag: 'a',
	attributes: [{
		name: 'class',
		value: 'highlightlink'
	}],
	createBlock: createPostLink
}

function createPostLink(content, util, { commentUrlParser }) {
	const href = util.getAttribute('href')
	const postLink = parsePostLink(href, { commentUrlParser })
	return {
		type: 'post-link',
		boardId: postLink.boardId || null, // Will be set later in comment post-processing.
		threadId: postLink.threadId || null, // Will be set later in comment post-processing.
		postId: postLink.postId,
		content: content.slice('>>'.length),
		url: null // Will be set later in comment post-processing.
	}
}

export default [
	emoji,
	quoteLinkLegacy1,
	quoteLinkLegacy2,
	...PARSE_COMMENT_CONTENT_PLUGINS,
	...LEGACY_MARKUP_PLUGINS
]