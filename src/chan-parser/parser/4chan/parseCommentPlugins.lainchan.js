import {
	parseBold,
	parseItalic,
	parseUnderline,
	parseQuote,
	parseLink
} from './parseCommentPlugins'

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
	parseSpoiler,
	parseQuote,
	parseLink,
	parseCode
]