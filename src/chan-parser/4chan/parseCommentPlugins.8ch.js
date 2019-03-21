import dropQuoteMarker from '../dropQuoteMarker'

import {
	parseBold,
	parseItalic,
	parseUnderline,
	parseStrikethrough,
	parseLink,
	parseCode
} from './parseCommentPlugins.4chan'

// `8ch.net` regular text.
const parseEightChanText = {
	tag: 'p',
	attributes: [
		{
			name: 'class',
			value: 'body-line ltr '
		}
	],
	createBlock(content) {
		return appendNewLine(content)
	}
}

// `8ch.net` "ASCII art" or "ShiftJIS art".
const parseEightChanAsciiOrShiftJISArt = {
	tag: 'span',
	attributes: [
		{
			name: 'class',
			value: 'aa'
		}
	],
	createBlock(content) {
		return {
			type: 'text',
			style: 'ascii-shift-jis-art',
			content
		}
	}
}

// `8ch.net` new line.
const parseEightChanNewLine = {
	tag: 'p',
	attributes: [
		{
			name: 'class',
			value: 'body-line empty '
		}
	],
	createBlock() {
		return '\n'
	}
}

// `8ch.net` "(((detected)))".
const parseEightChanDetected = {
	tag: 'span',
	attributes: [
		{
			name: 'class',
			value: 'detected'
		}
	],
	createBlock(content) {
		return {
			type: 'monospace',
			inline: true,
			content
		}
	}
}

// `8ch.net` heading.
const parseEightChanHeading = {
	tag: 'span',
	attributes: [
		{
			name: 'class',
			value: 'heading'
		}
	],
	createBlock(content) {
		return {
			type: 'text',
			style: '8ch-heading',
			content
		}
	}
}

// `8ch.net` spoiler.
const parseEightChanSpoiler = {
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

// `8ch.net` quote.
const parseEightChanQuote = {
	tag: 'p',
	attributes: [
		{
			name: 'class',
			value: 'body-line ltr quote'
		}
	],
	createBlock(content) {
		content = dropQuoteMarker(content)
		if (content) {
			return {
				type: 'inline-quote',
				content: appendNewLine(content)
			}
		}
	}
}

// `kohlchan.net` and `8ch.net` have regular quotes and "inverse" quotes.
const parseEightChanInverseQuote = {
	tag: 'p',
	attributes: [
		{
			name: 'class',
			value: 'body-line ltr rquote'
		}
	],
	createBlock(content) {
		content = dropQuoteMarker(content, '<')
		if (content) {
			return {
				type: 'inline-quote',
				kind: 'inverse',
				content: appendNewLine(content)
			}
		}
	}
}

export default [
	parseBold,
	parseItalic,
	parseUnderline,
	parseStrikethrough,
	parseLink,
	parseCode,
	parseEightChanText,
	parseEightChanAsciiOrShiftJISArt,
	parseEightChanNewLine,
	parseEightChanDetected,
	parseEightChanHeading,
	parseEightChanSpoiler,
	parseEightChanQuote,
	parseEightChanInverseQuote
]

function appendNewLine(content) {
	if (Array.isArray(content)) {
		return content.concat('\n')
	} else {
		return [content, '\n']
	}
}