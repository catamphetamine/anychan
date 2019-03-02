import { describe, it } from './mocha'
import expectToEqual from './expectToEqual'
import parseComment from './parseComment'

function parseCommentTest(comment, expected, expectedWarnings = []) {
	const consoleWarn = console.warn
	const warnings = []
	console.warn = (text) => warnings.push(text)

	const result = parseComment(comment, {
		plugins: [
			{
				tag: 'strong',
				createBlock(content) {
					return {
						type: 'text',
						style: 'bold',
						content
					}
				}
			}
		]
	})

	console.warn = consoleWarn

	expectToEqual(warnings, expectedWarnings)
	expectToEqual(result, expected)
}

describe('parseComment', () => {
	it('should parse empty comments', () => {
		parseCommentTest(
			' ',
			undefined
		)
	})

	it('should skip unknown tags', () => {
		parseCommentTest(
			'<div>' +
				'<h1>Heading</h1>' +
				'<p>Text <strong>bold</strong> regular</p>' +
			'</div>' +
			'<br>' +
			'Rest text',
			[
				[
					'\n',
					'\n',
					'\n',
					'Heading',
					'\n',
					'\n',
					'\n',
					'\n',
					'Text ',
					{
						type: 'text',
						style: 'bold',
						content: 'bold'
					},
					' regular',
					'\n',
					'\n',
					'\n',
					'\n',
					'Rest text'
				]
			],
			[
				"Unknown comment node type",
				"Unknown comment node type",
				"Unknown comment node type"
			]
		)
	})
})

