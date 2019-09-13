import dropQuoteMarker from '../../../dropQuoteMarker'

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
			value: 'emote'
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

export default [
	emoji,
	...PARSE_COMMENT_CONTENT_PLUGINS,
	...LEGACY_MARKUP_PLUGINS
]