import {
	parseBold,
	parseItalic,
	parseUnderline,
	parseQuote,
	parseLink
} from './parseCommentPlugins'

import { getContentText } from 'webapp-frontend/src/utility/post/getPostText'

// They have advanced code highlighting.
// https://lainchan.org/faq.html
// `<code/>` tags are placed inside `<pre/>` tags
// because that's how the spec dictates.
// https://html.spec.whatwg.org/multipage/grouping-content.html#the-pre-element
// `<pre><code class="hljs clojure">...</code></pre>`.
const ARISUCHAN_INLINE_CODE_CLASS_REGEXP = /^inline\s?/
export const parseCodeBlock = {
	tag: 'pre',
	createBlock(content, utility) {
		let inline = false
		// `arisuchan.jp` marks inline code with "inline" CSS class:
		// `<pre class="inline"><code class="inline nohighlight"></code></pre>`
		const cssClass = utility.getAttribute('class')
		if (ARISUCHAN_INLINE_CODE_CLASS_REGEXP.test(cssClass)) {
			inline = true
		}
		if (Array.isArray(content) &&
			content.length === 1 &&
			typeof content[0] === 'object' &&
			content[0].type === 'code') {
			if (!inline) {
				delete content[0].inline
			}
			return content[0]
		}
		const result = {
			type: 'code',
			content
		}
		if (inline) {
			result.inline = true
		}
		return result
	}
}

// `lainchan` has:
// `<pre><code class="hljs clojure">...</code></pre>`.
// `arisuchan` has:
// `<pre class="block"><code class="block hljs clojure">...</code></pre>`.
// Actually, `arisuchan` doesn't provide the "hljs clojure" part in JSON API response.
// I guess I see why that's the case: `arisuchan` most likely uses `highlight.js`'s
// "autodetect" feature which requires all syntaxes be loaded which is not an option.
const CODE_LANG_REGEXP = /\bhljs (\S+)$/
export const parseCode = {
	tag: 'code',
	createBlock(content, utility) {
		const result = {
			type: 'code',
			inline: true,
			content: content && getContentText(content)
		}
		// `lainchan` has:
		// `<pre><code class="hljs clojure">...</code></pre>`.
		// `arisuchan` has:
		// `<pre class="block"><code class="block hljs clojure">...</code></pre>`.
		const cssClass = utility.getAttribute('class')
		if (cssClass) {
			const langMatch = cssClass.match(CODE_LANG_REGEXP)
			if (langMatch) {
				result.language = langMatch[1]
			}
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