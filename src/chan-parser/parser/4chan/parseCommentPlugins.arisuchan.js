import {
	parseQuote,
	parseLink
} from './parseCommentPlugins'

export const parseBold = {
	tag: 'span',
	attributes: [
		{
			name: 'class',
			value: 'bold'
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

export const parseItalic = {
	tag: 'span',
	attributes: [
		{
			name: 'class',
			value: 'italic'
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

export const parseUnderline = {
	tag: 'span',
	attributes: [
		{
			name: 'class',
			value: 'underline'
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

const parseStrikethrough = {
	tag: 'span',
	attributes: [
		{
			name: 'class',
			value: 'strikethrough'
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

const parseHeading = {
	tag: 'span',
	attributes: [
		{
			name: 'class',
			value: 'header'
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

// They have advanced code highlighting.
// https://lainchan.org/faq.html
const CODE_LANG_REGEXP = /^hljs (\S+)$/
export const parseCode = {
	tag: 'pre',
	// tag: 'code',
	// attributes: [
	// 	{
	// 		name: 'class',
	// 		value: 'hljs'
	// 	}
	// ],
	createBlock(content, utility) {
		const result = {
			type: 'monospace',
			// inline: true,
			content
		}
		// `<pre><code class="hljs clojure">...</code></pre>`.
		// const cssClass = utility.getAttribute('class')
		// const langMatch = cssClass.match(CODE_LANG_REGEXP)
		// if (langMatch) {
		// 	result.language = langMatch[0]
		// }
		return result
	}
}

const parseSpoiler = {
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

export default [
	parseBold,
	parseItalic,
	parseUnderline,
	parseStrikethrough,
	parseHeading,
	parseSpoiler,
	parseQuote,
	parseLink,
	parseCode
]