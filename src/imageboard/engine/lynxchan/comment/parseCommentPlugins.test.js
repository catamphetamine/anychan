import PARSE_COMMENT_PLUGINS from './parseCommentPlugins.kohlchan'

import { describe, it } from '../../../utility/mocha'
import expectToEqual from '../../../utility/expectToEqual'
import parseComment from '../../../parseComment'
import splitParagraphs from '../../../splitParagraphs'
import trimWhitespace from '../../../utility/trimWhitespace'

function parseCommentTest(comment, expected, expectedWarnings = []) {
	const consoleWarn = console.warn
	const warnings = []
	console.warn = (text) => warnings.push(text)

	comment = parseComment(comment, {
		plugins: PARSE_COMMENT_PLUGINS
	})

	console.warn = consoleWarn

	comment = splitParagraphs(comment)
	// `content` internals will be mutated.
	comment = trimWhitespace(comment)

	expectToEqual(warnings, expectedWarnings)
	expectToEqual(comment, expected)
}

describe('parseComment', () => {
	it('should parse markup', () => {
		parseCommentTest(
			'<strong>fett</strong><br><s>strike</s><br><em>italienisch</em><br><u>unterstrichen</u>',
			[
				[
					{
						type: 'text',
						style: 'bold',
						content: 'fett'
					},
					'\n',
					{
						type: 'text',
						style: 'strikethrough',
						content: 'strike'
					},
					'\n',
					{
						type: 'text',
						style: 'italic',
						content: 'italienisch'
					},
					'\n',
					{
						type: 'text',
						style: 'underline',
						content: 'unterstrichen'
					}
				]
			]
		)
	})
})

