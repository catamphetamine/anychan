import { describe, it } from '../../mocha'
import expectToEqual from '../../expectToEqual'

import parseComment from './parseComment'
import PARSE_COMMENT_PLUGINS from './parseCommentPlugins.4chan'

function parseCommentTest(comment, options, expected, expectedWarnings = []) {
	const consoleWarn = console.warn
	const warnings = []
	console.warn = (text) => warnings.push(text)

	comment = parseComment(comment, {
		...options,
		chan: '4chan',
		parseCommentPlugins: PARSE_COMMENT_PLUGINS
	})

	console.warn = consoleWarn

	expectToEqual(warnings, expectedWarnings)
	expectToEqual(comment, expected)
}

describe('parseComment', () => {
	it('should detect banned posts', () => {
		const date = new Date()
		parseCommentTest(
			{
				no: 456,
				time: date.getTime() / 1000,
				com: "Text.\u003cbr\u003e\u003cbr\u003e\u003cb style=\"color:red;\"\u003e(USER WAS BANNED FOR THIS POST)\u003c/b\u003e",
			},
			{
				boardId: 'b',
				threadId: 123
			},
			{
				id: 456,
				createdAt: date,
				authorWasBanned: true,
				content: [
					[
						'Text.'
					]
				]
			}
		)
	})

	it('should detect "administrator" role', () => {
		const date = new Date()
		parseCommentTest(
			{
				no: 456,
				time: date.getTime() / 1000,
				capcode: 'admin',
				com: 'Text',
			},
			{
				boardId: 'b',
				threadId: 123
			},
			{
				id: 456,
				createdAt: date,
				authorRole: 'administrator',
				content: [
					[
						'Text'
					]
				]
			}
		)
	})

	it('should detect "moderator" role', () => {
		const date = new Date()
		parseCommentTest(
			{
				no: 456,
				time: date.getTime() / 1000,
				capcode: 'mod',
				com: 'Text',
			},
			{
				boardId: 'b',
				threadId: 123
			},
			{
				id: 456,
				createdAt: date,
				authorRole: 'moderator',
				content: [
					[
						'Text'
					]
				]
			}
		)
	})

	it('should handle "<wbr>" tags', () => {
		const date = new Date()
		parseCommentTest(
			{
				no: 456,
				time: date.getTime() / 1000,
				com: 'Te<wbr>xt',
			},
			{
				boardId: 'b',
				threadId: 123
			},
			{
				id: 456,
				createdAt: date,
				content: [
					[
						'Text' // Contains no "breaking space" in the middle.
					]
				]
			}
		)
	})
})