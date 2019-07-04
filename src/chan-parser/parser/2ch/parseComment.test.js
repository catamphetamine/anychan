import { describe, it } from '../../mocha'
import expectToEqual from '../../expectToEqual'

import parseComment from './parseComment'
import correctGrammar from './correctGrammar'
import PARSE_COMMENT_PLUGINS from './parseCommentPlugins'

function parseCommentTest(comment, options, expected, expectedWarnings = []) {
	const consoleWarn = console.warn
	const warnings = []
	console.warn = (text) => warnings.push(text)

	comment = parseComment(comment, {
		...options,
		correctGrammar,
		parseCommentPlugins: PARSE_COMMENT_PLUGINS
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
				num: '456',
				files: [],
				timestamp: date.getTime() / 1000,
				comment: "Текст.\u003cbr\u003e\u003cbr\u003e\u003cspan class=\"thanks-abu\" style=\"color: red;\"\u003eАбу благословил этот пост.\u003c/span\u003e",
				banned: 0
			},
			{
				boardId: 'b',
				threadId: 123,
			},
			{
				id: 456,
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

	it('should detect "administrator" role', () => {
		const date = new Date()
		parseCommentTest(
			{
				num: '456',
				files: [],
				timestamp: date.getTime() / 1000,
				comment: 'Текст',
				trip: '!!%adm%!!'
			},
			{
				boardId: 'b',
				threadId: 123,
			},
			{
				id: 456,
				authorRole: 'administrator',
				createdAt: date,
				content: [
					[
						'Текст'
					]
				]
			}
		)
	})

	it('should detect "moderator" role', () => {
		const date = new Date()
		parseCommentTest(
			{
				num: '456',
				files: [],
				timestamp: date.getTime() / 1000,
				comment: 'Текст',
				trip: '!!%mod%!!'
			},
			{
				boardId: 'b',
				threadId: 123,
			},
			{
				id: 456,
				authorRole: 'moderator',
				createdAt: date,
				content: [
					[
						'Текст'
					]
				]
			}
		)
	})

	it('should detect banned posts', () => {
		const date = new Date()
		parseCommentTest(
			{
				num: '456',
				files: [],
				timestamp: date.getTime() / 1000,
				comment: 'Текст',
				trip: '!!5pvF7WEJc.',
				banned: 1
			},
			{
				boardId: 'b',
				threadId: 123,
			},
			{
				id: 456,
				authorBanned: true,
				tripCode: '!!5pvF7WEJc.',
				createdAt: date,
				content: [
					[
						'Текст'
					]
				]
			}
		)
	})
})