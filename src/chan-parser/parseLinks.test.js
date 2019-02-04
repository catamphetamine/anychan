import { describe, it } from './mocha'
import expectToEqual from './expectToEqual'
import parseLinks from './parseLinks'

describe('parseLinks', () => {
	it('should parse links in text', () => {
		let post = {}
		parseLinks(post)
		expectToEqual(
			post,
			{}
		)

		post = {
			content: [
				[
					'Abc'
				]
			]
		}
		parseLinks(post)
		expectToEqual(
			post,
			{
				content: [
					[
						'Abc'
					]
				]
			}
		)

		post = {
			content: [
				[
					'Abc http://twitter.com/abc def'
				]
			]
		}
		parseLinks(post)
		expectToEqual(
			post,
			{
				content: [
					[
						'Abc ',
						{
							type: 'link',
							url: 'http://twitter.com/abc',
							content: 'twitter.com/abc'
						},
						' def'
					]
				]
			}
		)

		post = {
			content: [
				[
					{
						type: 'inline-quote',
						content: 'Abc http://twitter.com/abc def'
					},
					'Abc http://twitter.com/abc def',
					{
						type: 'link',
						url: 'http://twitter.com/abc',
						content: 'Abc http://twitter.com/abc def'
					}
				]
			]
		}
		parseLinks(post)
		expectToEqual(
			post,
			{
				content: [
					[
						{
							type: 'inline-quote',
							content: 'Abc http://twitter.com/abc def'
						},
						'Abc ',
						{
							type: 'link',
							url: 'http://twitter.com/abc',
							content: 'twitter.com/abc'
						},
						' def',
						{
							type: 'link',
							url: 'http://twitter.com/abc',
							content: 'Abc http://twitter.com/abc def'
						}
					]
				]
			}
		)
	})
})
