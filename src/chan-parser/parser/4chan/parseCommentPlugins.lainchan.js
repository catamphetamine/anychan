import {
	parseBold,
	parseItalic,
	parseUnderline,
	parseQuote,
	parseLink
} from './parseCommentPlugins'

// They have advanced code highlighting.
// https://lainchan.org/faq.html
// `<code/>` tags are placed inside `<pre/>` tags
// because that's how the spec dictates.
// https://html.spec.whatwg.org/multipage/grouping-content.html#the-pre-element
// `<pre><code class="hljs clojure">...</code></pre>`.
export const parseCodeBlock = {
	tag: 'pre',
	createBlock(content, utility) {
		if (Array.isArray(content) &&
			content.length === 1 &&
			typeof content[0] === 'object' &&
			content[0].type === 'monospace') {
			delete content[0].inline
			return content[0]
		}
		return {
			type: 'monospace',
			content
		}
	}
}

const CODE_LANG_REGEXP = /^hljs (\S+)$/
export const parseCode = {
	tag: 'code',
	createBlock(content, utility) {
		const result = {
			type: 'monospace',
			inline: true,
			content
		}
		// `<pre><code class="hljs clojure">...</code></pre>`.
		const cssClass = utility.getAttribute('class')
		const langMatch = cssClass.match(CODE_LANG_REGEXP)
		if (langMatch) {
			result.language = langMatch[1]
		}
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
	parseCode,
	parseCodeBlock
]