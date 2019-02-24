import unescapeContent from 'webapp-frontend/src/utility/unescapeContent'
import findClosingTagPosition from './findClosingTagPosition'

/**
 * Parses comment HTML.
 * Returns an array of paragraphs.
 * @param  {object} comment
 * @param  {object} options — `{ plugins }`
 * @return {any[][]}
 */
export default function parseCommentText(comment, options = {}) {
	return new CommentTextParser(options).parse(comment)
}

class CommentTextParser {
	constructor(options) {
		this.options = options
	}

	parse(comment) {
		comment = this.preProcess(comment)
		// Remove excessive `<br>`s.
		comment = this.normalizeNewLines(comment)
		// Parse into paragraphs.
		if (this.options.parseParagraphs !== false) {
			const paragraphs = comment.split(/<br\/><br\/>/)
			return paragraphs
				.filter(_ => _)
				.map(_ => _.trim())
				// There are cases when people write:
				// "<strong>Abc<br/><br/>Def</strong>" on 2ch.hk.
				// In such cases it will split the HTML into two paragraphs:
				// "<strong>Abc" and "Def</strong>".
				// I consider such cases penalized because it's an abuse:
				// message syntax should stay as simple and conventional as possible.
				// Therefore such "invalid" unpaired HTML tags
				// are simply stripped from paragraph HTML.
				.map(_ => _.trim())
				.map(this.parseParagraph)
		}
		return [this.parseParagraph(comment)]
	}

	preProcess(html) {
		return html
			// Normalize `<br>`s so that they don't break parsing (`findClosingTagPosition()`).
			.replace(/\s*<br>\s*/g, '<br/>')
			// `<p>html</p>` -> `html<br/><br/>`
			.replace(/<p.*?>(.*?)<\/p>/g, '<br/><br/>$1<br/><br/>')
			// `<div>html</div>` -> `html<br/>`
			.replace(/<div.*?>(.*?)<\/div>/g, '<br/>$1<br/>')
			// `<h1>html</h1>` -> `html<br/><br/>`
			.replace(/<h1.*?>(.*?)<\/h1>/g, '<br/><br/>$1<br/><br/>')
	}

	normalizeNewLines(html) {
		// Remove excessive `<br>`s.
		return html
			// Convert more than two `<br>`s into two `<br>`s.
			.replace(/<br\/>(\s*<br\/>)+/g, '<br/><br/>')
			// Trim one or two `<br>`s in the beginning.
			.replace(/^<br\/>(<br\/>)?/, '')
			// Trim one or two `<br>`s in the end.
			.replace(/<br\/>(<br\/>)?$/, '')
			// Trim whitespace.
			.trim()
	}

	// Returns an array of inline elements.
	// Some of such inline elements may be empty strings
	// which are later filtered by `parseCommentText()`.
	parseParagraph = (text) => {
		// text = removeInvalidClosingTags(text)
		const nextTag = this.findNextTag(text)
		// `nextTag` can be an empty string if HTML is corrected.
		if (nextTag !== undefined) {
			if (typeof nextTag === 'string') {
				// HTML corrected.
				text = nextTag
			} else {
				for (const plugin of this.options.plugins) {
					const parsed = this.parseHtmlTag(text, nextTag, plugin)
					if (parsed) {
						return parsed.filter(_ => _)
					}
				}
				console.warn(`Unsupported tag found: "<${nextTag.openerContent}>"`)
				const parsed = this.parseHtmlTag(text, nextTag, PARSE_ANY_TAG_PLUGIN)
				if (parsed) {
					return parsed.filter(_ => _)
				}
			}
		}
		// Generic text.
		return [this.correctGrammar(unescapeContent(text))]
	}

	findNextTag(text) {
		const firstTagStartsAt = text.indexOf('<')
		if (firstTagStartsAt < 0) {
			return
		}
		const firstTagEndsAt = text.indexOf('>', firstTagStartsAt + '<'.length)
		// Check for invalid HTML syntax.
		if (firstTagEndsAt < 0) {
			return
		}
		// Check for invalid HTML syntax.
		if (text[firstTagStartsAt + '<'.length] === '/') {
			// Invalid HTML markup: non-matched closing tag.
			console.error(`Invalid HTML markup: non-matched closing tag found\n\n${text}`)
			// Correct HTML markup: remove the closing tag.
			return text.slice(0, firstTagStartsAt) + text.slice(firstTagEndsAt + '>'.length)
		}
		// Get tag content.
		let openerContent = text.slice(firstTagStartsAt + '<'.length, firstTagEndsAt)
		// Handle self-closing tags.
		if (openerContent[openerContent.length - 1] === '/') {
			openerContent = openerContent.slice(0, openerContent.length - 1)
		}
		// Get tag name.
		const tagName = openerContent.indexOf(' ') > 0 ? openerContent.slice(0, openerContent.indexOf(' ')) : openerContent
		return {
			tagName,
			openerContent,
			openerStartsAt: firstTagStartsAt,
			openerEndsAt: firstTagEndsAt
		}
	}

	parseHtmlTag(text, { tagName, openerContent, openerStartsAt, openerEndsAt }, { tag, matchAttributes, attributes, canContainChildren, correctContent, createBlock }) {
		// Check that the `tag` matches.
		if (tag !== '*') {
			let opener = '<' + tag
			if (matchAttributes) {
				opener += ' ' + matchAttributes
			}
			// First parse outer tags, then inner tags.
			if (
				!isStringAt(opener, text, openerStartsAt) ||
				(
					text[openerStartsAt + opener.length] !== '/' &&
					text[openerStartsAt + opener.length] !== ' ' &&
					text[openerStartsAt + opener.length] !== '>'
				)
			) {
				return
			}
		}
		// Parse content.
		const startsAt = openerStartsAt
		let endsAt
		let content
		if (canContainChildren !== false) {
			const contentStartsAt = openerEndsAt + '>'.length
			const contentEndsAt = findClosingTagPosition(text, contentStartsAt)
			if (contentEndsAt < 0) {
				// Invalid HTML markup: no closing tag found.
				console.error(`Invalid HTML markup: no closing tag found for "${tagName}"\n\n${text}`)
				// Correct HTML markup: remove the opening tag.
				return this.parseParagraph(text.slice(0, startsAt) + text.slice(contentStartsAt))
			}
			endsAt = text.indexOf('>', contentEndsAt) + '>'.length
			// Check for invalid HTML syntax.
			if (endsAt < 0) {
				// Invalid HTML markup: no closing tag found.
				console.error(`Invalid HTML markup: no closing tag found for "${tagName}"\n\n${text}`)
				// Correct HTML markup: remove the opening tag.
				return this.parseParagraph(text.slice(0, startsAt) + text.slice(contentStartsAt))
			}
			const isSameClosingTag = isStringAt(tagName, text, contentEndsAt + '</'.length)
			if (!isSameClosingTag) {
				// Invalid HTML markup: non-matching closing tag.
				console.error(`Invalid HTML markup: non-matching closing tag for tag "${tagName}"\n\n${text}`)
				// Correct HTML markup: remove the closing tag.
				return this.parseParagraph(text.slice(0, contentEndsAt) + text.slice(endsAt + '>'.length))
			}
			content = text.slice(contentStartsAt, contentEndsAt)
			// If there are nested tags then maybe parse them.
			// Post links seem to contain unescaped `>>`s which is a bug.
			if (content.indexOf('<') >= 0) {
				content = this.parseParagraph(content)
			} else {
				content = correctContent === false ? unescapeContent(content) : this.correctGrammar(unescapeContent(content))
			}
		} else {
			endsAt = text.indexOf('>', startsAt) + '>'.length
		}
		// Parse attributes.
		const _attributes = []
		if (attributes) {
			const markup = openerContent
			for (const attribute of attributes) {
				const attributeDefinitionStartsAt = markup.indexOf(`${attribute}="`)
				if (attributeDefinitionStartsAt < 0) {
					_attributes.push()
					continue
				}
				const attributeStartsAt = attributeDefinitionStartsAt + `${attribute}="`.length
				const attributeEndsAt = markup.indexOf('"', attributeStartsAt)
				_attributes.push(
					unescapeContent(
						markup.slice(attributeStartsAt, attributeEndsAt)
					)
				)
			}
		}
		// Using `.concat` to skip `undefined`s.
		// Alternatively could use `.filter()`.
		return [].concat(
			this.parseParagraph(text.slice(0, startsAt)),
			createBlock(content, _attributes),
			this.parseParagraph(text.slice(endsAt))
		)
	}

	correctGrammar(text) {
		if (this.options.correctGrammar) {
			return this.options.correctGrammar(text)
		}
		return text
	}
}

// Won't work for "exotic" UTF-8 characters
// (the ones consisting of four bytes)
// but HTML tag characters don't fall into that range.
function isStringAt(substring, string, index) {
	let i = 0
	while (i < substring.length) {
		if (substring[i] !== string[index + i]) {
			return false
		}
		i++
	}
	return true
}

const PARSE_ANY_TAG_PLUGIN = {
	tag: '*',
	createBlock(content) {
		return content
	}
}