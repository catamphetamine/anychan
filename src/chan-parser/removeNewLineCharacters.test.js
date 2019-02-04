import { describe, it } from './mocha'
import expectToEqual from './expectToEqual'
import removeNewLineCharacters from './removeNewLineCharacters'

describe('removeNewLineCharacters', () => {
	it('should remove new line characters in paragraph text', () => {
		const post = {
			content: [
				[
					'a\\nb\\r\\nc'
				]
			]
		}

		removeNewLineCharacters(post)

		expectToEqual(
			post,
			{
				content: [
					[
						'abc'
					]
				]
			}
		)
	})

	it('should remove new line characters in nested blocks', () => {
		const post = {
			content: [
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
		}

		removeNewLineCharacters(post)

		expectToEqual(
			post,
			{
				content: [
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
			}
		)
	})
})