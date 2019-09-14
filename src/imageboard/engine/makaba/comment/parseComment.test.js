import { describe, it } from '../../../utility/mocha'
import expectToEqual from '../../../utility/expectToEqual'

import TwoChan from '../../../chan/2ch'

function parseCommentTest(comment, options, expected, expectedWarnings = []) {
	const consoleWarn = console.warn
	const warnings = []
	console.warn = (text) => warnings.push(text)

	comment = TwoChan({}).parseComment(comment, options, {})

	console.warn = consoleWarn

	expectToEqual(warnings, expectedWarnings)
	expectToEqual(comment, expected)
}

describe('parseComment', () => {
	it('should parse "thanks-abu" marker', () => {
		const date = new Date()
		parseCommentTest(
			{
				num: '123',
				files: [],
				timestamp: date.getTime() / 1000,
				comment: "Текст.\u003cbr\u003e\u003cbr\u003e\u003cspan class=\"thanks-abu\" style=\"color: red;\"\u003eАбу благословил этот пост.\u003c/span\u003e",
				banned: 0,
				parent: "0"
			},
			{
				boardId: 'b',
				threadId: 123,
			},
			{
				id: 123,
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
				num: '123',
				files: [],
				timestamp: date.getTime() / 1000,
				comment: 'Текст',
				trip: '!!%adm%!!',
				parent: "0"
			},
			{
				boardId: 'b',
				threadId: 123,
			},
			{
				id: 123,
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
				num: '123',
				files: [],
				timestamp: date.getTime() / 1000,
				comment: 'Текст',
				trip: '!!%mod%!!',
				parent: "0"
			},
			{
				boardId: 'b',
				threadId: 123,
			},
			{
				id: 123,
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
				num: '123',
				files: [],
				timestamp: date.getTime() / 1000,
				comment: 'Текст',
				trip: '!!5pvF7WEJc.',
				banned: 1,
				parent: "0"
			},
			{
				boardId: 'b',
				threadId: 123,
			},
			{
				id: 123,
				authorBan: true,
				authorTripCode: '!!5pvF7WEJc.',
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