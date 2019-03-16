import dropQuoteMarker from '../dropQuoteMarker'

// `kohlchan.net` spoiler.
const parseKohlChanSpoiler = {
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
const parseKohlChanInverseQuote = {
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
				type: 'inline-quote',
				kind: 'inverse',
				content
			}
		}
	}
}

export default [
	parseKohlChanSpoiler,
	parseKohlChanInverseQuote
]