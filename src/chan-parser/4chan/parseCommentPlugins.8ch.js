import dropQuoteMarker from '../dropQuoteMarker'

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
			type: 'text',
			style: 'italic',
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
			style: 'bold',
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
	parseEightChanText,
	parseEightChanNewLine,
	parseEightChanDetected,
	parseEightChanHeading,
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