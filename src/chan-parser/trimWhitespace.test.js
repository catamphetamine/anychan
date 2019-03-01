import { describe, it } from './mocha'
import expectToEqual from './expectToEqual'
import trimWhitespace from './trimWhitespace'

function trimWhitespaceTest(content, result) {
	// `content` internals will be mutated.
	content = trimWhitespace(content)
	return expectToEqual(content, result)
}

describe('trimWhitespace', () => {
	it('should trim new lines (simple text)', () => {
		trimWhitespaceTest(
			[
				[
					'\n',
					'\n',
					'\n',
					'abc',
					'\n',
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

	it('should trim new lines and whitespace (simple text)', () => {
		trimWhitespaceTest(
			[
				[
					'\n',
					' ',
					'\n',
					'   ',
					'\n',
					' abc ',
					'\n',
					'\t',
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

	it('should trim new lines (nested blocks)', () => {
		trimWhitespaceTest(
			[
				[
					'\n',
					{
						type: 'text',
						style: 'bold',
						content: [
							'\n',
							'\n',
							{
								type: 'text',
								style: 'italic',
								content: [
									'\n',
									'abc',
									'\n',
									'\n',
									'def',
									'\n'
								]
							},
							'\n'
						]
					},
					'\n',
					'\n'
				]
			],
			[
				[
					{
						type: 'text',
						style: 'bold',
						content: [
							{
								type: 'text',
								style: 'italic',
								content: [
									'abc',
									'\n',
									'\n',
									'def'
								]
							}
						]
					}
				]
			]
		)
	})

	it('should trim new lines (nested blocks + trailing content)', () => {
		trimWhitespaceTest(
			[
				[
					'\n',
					{
						type: 'text',
						style: 'bold',
						content: [
							'\n',
							'\n',
							{
								type: 'text',
								style: 'italic',
								content: [
									'\n',
									'abc',
									'\n',
									'\n',
									'def',
									'\n'
								]
							},
							'\n'
						]
					},
					'\n',
					'ghi',
					'\n'
				]
			],
			[
				[
					{
						type: 'text',
						style: 'bold',
						content: [
							{
								type: 'text',
								style: 'italic',
								content: [
									'abc',
									'\n',
									'\n',
									'def',
									'\n'
								]
							},
							'\n'
						]
					},
					'\n',
					'ghi'
				]
			]
		)
	})
})

