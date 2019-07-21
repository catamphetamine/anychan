import { describe, it } from '../../mocha'
import expectToEqual from '../../expectToEqual'

import parseComment from './parseComment'
import PARSE_COMMENT_PLUGINS from './parseCommentPlugins.kohlchan'

function parseCommentTest(comment, options, expected, expectedWarnings = []) {
	const consoleWarn = console.warn
	const warnings = []
	console.warn = (text) => warnings.push(text)

	const attachmentsAreBeingTested = comment.files !== undefined

	comment = parseComment({
		files: [],
		...comment
	}, {
		...options,
		chan: 'kohlchan',
		parseCommentPlugins: PARSE_COMMENT_PLUGINS
	})

	if (!attachmentsAreBeingTested) {
		delete comment.attachments
	}

	console.warn = consoleWarn

	expectToEqual(warnings, expectedWarnings)
	expectToEqual(comment, expected)
}

describe('parseComment', () => {
	it('should detect banned posts', () => {
		const date = new Date()
		parseCommentTest(
			{
				postId: 456,
				creation: date.toISOString(),
				markdown: 'Text',
				banMessage: '(USER WAS BANNED FOR THIS POST)'
			},
			{
				boardId: 'b',
				threadId: 123
			},
			{
				id: 456,
				createdAt: date,
				authorBanned: true,
				authorBanReason: '(USER WAS BANNED FOR THIS POST)',
				content: [
					[
						'Text'
					]
				]
			}
		)
	})

	it('should detect "administrator" role', () => {
		const date = new Date()
		parseCommentTest(
			{
				postId: 456,
				creation: date.toISOString(),
				markdown: 'Text',
				signedRole: 'Root'
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
				postId: 456,
				creation: date.toISOString(),
				markdown: 'Text',
				signedRole: 'Global volunteer'
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

	it('should parse kohlchan.net custom flags', () => {
		const date = new Date()
		parseCommentTest(
			{
				postId: 456,
				creation: date.toISOString(),
				markdown: 'Text',
				flag: "/.static/flags/onion.png",
				flagCode: null,
				flagName: "Onion"
			},
			{
				boardId: 'b',
				threadId: 123
			},
			{
				id: 456,
				createdAt: date,
				// authorIconId: 'onion',
				authorIconUrl: '/.static/flags/onion.png',
				authorIconName: 'Onion',
				content: [
					[
						'Text'
					]
				]
			}
		)
	})

	it('should parse kohlchan.net custom flags ("/vsa" subdirectory)', () => {
		const date = new Date()
		parseCommentTest(
			{
				postId: 456,
				creation: date.toISOString(),
				markdown: 'Text',
				flag: "/.static/flags/vsa/ca.png",
				flagCode: null,
				flagName: "California"
			},
			{
				boardId: 'b',
				threadId: 123
			},
			{
				id: 456,
				createdAt: date,
				// authorIconId: 'vsa/ca',
				authorIconUrl: '/.static/flags/vsa/ca.png',
				authorIconName: 'California',
				content: [
					[
						'Text'
					]
				]
			}
		)
	})

	it('should parse kohlchan.net country flags', () => {
		const date = new Date()
		parseCommentTest(
			{
				postId: 456,
				creation: date.toISOString(),
				markdown: 'Text',
				flag: "/.static/flags/de.png",
				flagCode: '-br',
				flagName: "Deutschland"
			},
			{
				boardId: 'b',
				threadId: 123
			},
			{
				id: 456,
				createdAt: date,
				authorCountry: 'DE',
				content: [
					[
						'Text'
					]
				]
			}
		)
	})
})