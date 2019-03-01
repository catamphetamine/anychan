import { describe, it } from './mocha'
import expectToEqual from './expectToEqual'
import splitParagraphs from './splitParagraphs'

function splitParagraphsTest(content, result) {
	return expectToEqual(splitParagraphs(content), result)
}

describe('splitParagraphs', () => {
	it('shouldn\'t split paragraphs if there\'s no split', () => {
		splitParagraphsTest(
			[
				[
					'abc',
					'def'
				]
			],
			[
				[
					'abc',
					'def'
				]
			]
		)
	})

	it('should skip empty paragraphs when splitting paragraphs (simple text)', () => {
		splitParagraphsTest(
			[
				[
					'abc',
					'\n',
					'\n',
					'\n',
					'\n',
					'\n',
					'\n',
					'\n',
					'\n',
					'\n',
					'def'
				]
			],
			[
				[
					'abc'
				],
				[
					'\n',
					'def'
				]
			]
		)
	})

	it('should trim empty paragraphs', () => {
		splitParagraphsTest(
			[
				[
					'abc',
					'\n',
					'\n'
				]
			],
			[
				[
					'abc'
				]
			]
		)
	})

	it('should trim empty paragraphs', () => {
		splitParagraphsTest(
			[
				[
					'\n',
					'\n',
					'abc'
				]
			],
			[
				[
					'abc'
				]
			]
		)
	})

	it('should split paragraphs (nested blocks)', () => {
		splitParagraphsTest(
			[
				[
					'abc',
					{
						type: 'text',
						style: 'bold',
						content: [
							'def',
							{
								type: 'text',
								style: 'italic',
								content: [
									'ghi',
									'\n',
									'\n',
									'\n',
									'jkl'
								]
							},
							{
								type: 'text',
								style: 'italic',
								content: [
									'mno'
								]
							}
						]
					},
					'pqr'
				]
			],
			[
				[
					'abc',
					{
						type: 'text',
						style: 'bold',
						content: [
							'def',
							{
								type: 'text',
								style: 'italic',
								content: 'ghi'
							}
						]
					}
				],
				[
					{
						type: 'text',
						style: 'bold',
						content: [
							{
								type: 'text',
								style: 'italic',
								content: [
									'\n',
									'jkl'
								]
							},
							{
								type: 'text',
								style: 'italic',
								content: [
									'mno'
								]
							}
						]
					},
					'pqr'
				]
			]
		)
	})
})

