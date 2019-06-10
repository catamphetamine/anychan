import { describe, it } from './mocha'
import expectToEqual from './expectToEqual'
import removeNewLineCharacters from './removeNewLineCharacters'

describe('removeNewLineCharacters', () => {
	it('should remove new line characters in paragraph text', () => {
		const content = [
			[
				'a\\nb\\r\\nc'
			]
		]

		removeNewLineCharacters(content)

		expectToEqual(
			content,
			[
				[
					'abc'
				]
			]
		)
	})

	it('should skip non-array paragraphs', () => {
		const content = [
			{
				type: 'attachment',
				attachmentId: 1
			},
			[
				'a\\nb\\r\\nc'
			]
		]

		removeNewLineCharacters(content)

		expectToEqual(
			content,
			[
				{
					type: 'attachment',
					attachmentId: 1
				},
				[
					'abc'
				]
			]
		)
	})

	it('should remove new line characters in nested blocks', () => {
		const content = [
			[
				{
					type: 'quote',
					content: [
						{
							type: 'text',
							style: 'bold',
							content: [
								{
									type: 'link',
									url: 'https://google.com',
									content: 'a\\nb\\r\\nc'
								}
							]
						},
						'a\\nb\\r\\nc'
					]
				},
				'a\\nb\\r\\nc'
			]
		]

		removeNewLineCharacters(content)

		expectToEqual(
			content,
			[
				[
					{
						type: 'quote',
						content: [
							{
								type: 'text',
								style: 'bold',
								content: [
									{
										type: 'link',
										url: 'https://google.com',
										content: 'abc'
									}
								]
							},
							'abc'
						]
					},
					'abc'
				]
			]
		)
	})
})