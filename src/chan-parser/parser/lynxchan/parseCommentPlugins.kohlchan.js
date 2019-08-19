import dropQuoteMarker from '../../dropQuoteMarker'

import DEFAULT_PLUGINS from './parseCommentPlugins'

// Since May 28th, 2019 `kohlchan.net` has been migrated from `vichan` to `lynxchan`.
// The old messages still have the old markup.
import LEGACY_MARKUP_PLUGINS from '../4chan/parseCommentPlugins.kohlchan'

const EMOTE_ID_REG_EXP = /^\/\.static\/images\/([^/]+)\.png$/

const parseKohlChanEmoji = {
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
	createBlock(content, util, { emojiUrl, formatUrl }) {
		const url = util.getAttribute('src')
		// "/.static/images/chen.png" -> "chen"
		const match = url.match(EMOTE_ID_REG_EXP)
		return {
			type: 'emoji',
			name: match ? match[1] : 'emoji',
			url: formatUrl(emojiUrl, { url })
		}
	}
}

export default [
	parseKohlChanEmoji,
	...DEFAULT_PLUGINS,
	...LEGACY_MARKUP_PLUGINS
]