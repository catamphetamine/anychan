import dropQuoteMarker from '../../../dropQuoteMarker'

import {
	bold,
	italic,
	quote,
	link
} from './parseCommentContentPlugins'

// `kohlchan.net` spoiler.
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

// `kohlchan.net` and `8ch.net` have regular quotes and "inverse" quotes.
const inverseQuote = {
	tag: 'span',
	attributes: [
		{
			name: 'class',
			value: 'quote2'
		}
	],
	createBlock(content) {
		content = dropQuoteMarker(content, '<')
		if (content) {
			return {
				type: 'quote',
				kind: 'inverse',
				content
			}
		}
	}
}

// `kohlchan.net` underlined text.
const underline = {
	tag: 'span',
	attributes: [
		{
			name: 'style',
			value: 'text-decoration: underline'
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

// `kohlchan.net` strikethrough text.
const strikethrough = {
	tag: 'span',
	attributes: [
		{
			name: 'style',
			value: 'text-decoration: line-through'
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

// `kohlchan.net` code.
const code = {
	tag: 'code',
	createBlock(content) {
		return {
			type: 'code',
			inline: true,
			content
		}
	}
}

export default [
	bold,
	italic,
	quote,
	link,
	spoiler,
	inverseQuote,
	underline,
	strikethrough,
	code
]