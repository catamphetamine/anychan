import dropQuoteMarker from '../../../dropQuoteMarker'

import {
	bold,
	italic,
	underline,
	link,
	code
} from './parseCommentContentPlugins'

const strikethrough = {
	tag: 's',
	createBlock(content) {
		return {
			type: 'text',
			style: 'strikethrough',
			content
		}
	}
}

// `8ch.net` regular text.
const text = {
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
const asciiShiftJisArt = {
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
const newLine = {
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
const detected = {
	tag: 'span',
	attributes: [
		{
			name: 'class',
			value: 'detected'
		}
	],
	createBlock(content) {
		return {
			type: 'code',
			inline: true,
			content
		}
	}
}

// Red heading.
const heading = {
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
			style: 'heading',
			content
		}
	}
}

// `8ch.net` spoiler.
const spoiler = {
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
const quote = {
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
				type: 'quote',
				content: appendNewLine(content)
			}
		}
	}
}

// `kohlchan.net` and `8ch.net` have regular quotes and "inverse" quotes.
const inverseQuote = {
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
				type: 'quote',
				kind: 'inverse',
				content: appendNewLine(content)
			}
		}
	}
}

export default [
	bold,
	italic,
	underline,
	strikethrough,
	link,
	code,
	text,
	asciiShiftJisArt,
	newLine,
	detected,
	heading,
	spoiler,
	quote,
	inverseQuote
]

function appendNewLine(content) {
	if (Array.isArray(content)) {
		return content.concat('\n')
	} else {
		return [content, '\n']
	}
}