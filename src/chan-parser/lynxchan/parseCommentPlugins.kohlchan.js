import dropQuoteMarker from '../dropQuoteMarker'

import {
	parseBold,
	parseItalic,
	parseUnderline,
	parseStrikethrough,
	parseSpoiler,
	parseQuote,
	parseLink
} from './parseCommentPlugins'

// `kohlchan.net` has regular quotes and "inverse" quotes.
const parseKohlChanInverseQuote = {
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
const parseKohlChanInverseQuote2 = {
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
				kind: 'inverse',
				content
			}
		}
	}
}

const EMOTE_ID_REG_EXP = /^\/\.static\/images\/([^/]+)\.png$/

const parseKohlChanEmote = {
	tag: 'img',
	attributes: [
		{
			name: 'class',
			value: 'emote'
		}
	],
	createBlock(content, util) {
		// "/.static/images/chen.png" -> "chen"
		const match = EMOTE_ID_REG_EXP.match(util.getAttribute('src'))
		if (match) {
			return `(:${match[1]}:)`
		}
		return '(:emoji:)'
	}
}

export default [
	parseBold,
	parseItalic,
	parseUnderline,
	parseStrikethrough,
	parseSpoiler,
	parseQuote,
	parseKohlChanInverseQuote,
	parseKohlChanInverseQuote2,
	parseKohlChanEmote,
	parseLink
]