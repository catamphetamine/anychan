import dropQuoteMarker from '../../dropQuoteMarker'

import {
	parseBold,
	parseItalic,
	parseUnderline,
	parseStrikethrough,
	parseSpoiler,
	parseQuote,
	parseLink
} from './parseCommentPlugins'

// Since May 28th, 2019 `kohlchan.net` has been migrated from `vichan` to `lynxchan`.
// The old messages still have the old markup.
import legacyMarkupPlugins from '../4chan/parseCommentPlugins.kohlchan'

// `kohlchan.net` has regular quotes and "inverse" quotes.
const parseKohlChanRedQuote = {
	tag: 'span',
	attributes: [
		{
			name: 'class',
			value: 'redText'
		}
	],
	createBlock(content) {
		content = dropQuoteMarker(content, '<')
		if (content) {
			return {
				type: 'inline-quote',
				kind: 'inverse',
				content
			}
		}
	}
}

// `kohlchan.net` has regular quotes and "inverse" quotes,
// and also some "orange" quotes which are ignored.
const parseKohlChanOrangeQuote = {
	tag: 'span',
	attributes: [
		{
			name: 'class',
			value: 'orangeText'
		}
	],
	createBlock(content) {
		content = dropQuoteMarker(content, '<')
		if (content) {
			return {
				type: 'inline-quote',
				kind: 'inverse-orange',
				content
			}
		}
	}
}

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
	createBlock(content, util, { emojiUrl }) {
		const url = util.getAttribute('src')
		// "/.static/images/chen.png" -> "chen"
		const match = url.match(EMOTE_ID_REG_EXP)
		return {
			type: 'emoji',
			name: match ? match[1] : 'emoji',
			url: emojiUrl.replace('{url}', url)
		}
	}
}

export default [
	parseBold,
	parseItalic,
	parseUnderline,
	parseStrikethrough,
	parseSpoiler,
	parseQuote,
	parseKohlChanRedQuote,
	parseKohlChanOrangeQuote,
	parseKohlChanEmoji,
	parseLink,
	...legacyMarkupPlugins
]