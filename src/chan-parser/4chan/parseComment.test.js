import PARSE_COMMENT_PLUGINS from './parseCommentPlugins'

import { describe, it } from '../mocha'
import expectToEqual from '../expectToEqual'
import parseComment from '../parseComment'
import splitParagraphs from '../splitParagraphs'
import trimWhitespace from '../trimWhitespace'

function parseCommentTest(comment, expected, expectedWarnings) {
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
	it('should strip unmatched/unknown tags', () => {
		parseCommentTest(
			'<div align=\"center\"><br><h1><blink><font color=\"red\">\/s\/ is NOT for \/r\/EQUESTS<\/font><\/blink><\/h1><br><h1><font color=\"red\">Do not start a thread if you don\'t have at least 6 related pictures to post in it.<\/font><\/h1><br><br><\/div>',
			[
				[
    			"/s/ is NOT for /r/EQUESTS",
				],
				[
					"Do not start a thread if you don't have at least 6 related pictures to post in it."
				]
			],
			[
				'Unknown comment node type',
				'Unknown comment node type',
				'Unknown comment node type',
				'Unknown comment node type',
				'Unknown comment node type',
				'Unknown comment node type'
			]
		)
	})
})

