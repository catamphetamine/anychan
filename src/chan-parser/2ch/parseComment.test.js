import { describe, it } from '../mocha'
import expectToEqual from '../expectToEqual'

import parseComment from './parseComment'
import correctGrammar from './correctGrammar'
import PARSE_COMMENT_PLUGINS from './parseCommentPlugins'

function parseCommentTest(comment, expected, expectedWarnings = []) {
	const consoleWarn = console.warn
	const warnings = []
	console.warn = (text) => warnings.push(text)

	comment = parseComment(comment, {
		correctGrammar,
		plugins: PARSE_COMMENT_PLUGINS
	})

	console.warn = consoleWarn

	expectToEqual(warnings, expectedWarnings)
	expectToEqual(comment, expected)
}

describe('parseComment', () => {
	it('should parse "thanks-abu" marker', () => {
		const date = new Date()
		parseCommentTest(
			{
				boardId: 'b',
				threadId: 123,
				num: '456',
				files: [],
				timestamp: date.getTime() / 1000,
				comment: "Текст.\u003cbr\u003e\u003cbr\u003e\u003cspan class=\"thanks-abu\" style=\"color: red;\"\u003eАбу благословил этот пост.\u003c/span\u003e",
			},
			{
				id: 456,
				inReplyTo: [],
				attachments: [],
				createdAt: date,
				abuLike: true,
				content: [
					[
						'Текст.'
					]
				]
			}
		)
	})
})