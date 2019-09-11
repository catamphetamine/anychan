import { describe, it } from './utility/mocha'
import expectToEqual from './utility/expectToEqual'

import dropQuoteMarker from './dropQuoteMarker'

function dropQuoteMarkerTest(content, result) {
	return expectToEqual(dropQuoteMarker(content), result)
}

describe('dropQuoteMarker', () => {
	it('should drop quote marker for simple text quotes', () => {
		dropQuoteMarkerTest('>abc', 'abc')
		dropQuoteMarkerTest('> abc', 'abc')
		dropQuoteMarkerTest('>  abc', 'abc')
	})

	it('should drop quote marker when a quote contains nested elements', () => {
		dropQuoteMarkerTest(
			[
				'> abc',
				{
					type: 'text',
					style: 'bold',
					content: '> def'
				}
			],
			[
				'abc',
				{
					type: 'text',
					style: 'bold',
					content: '> def'
				}
			]
		)
		dropQuoteMarkerTest(
			[
				{
					type: 'text',
					style: 'bold',
					content: '> abc'
				},
				'> def'
			],
			[
				{
					type: 'text',
					style: 'bold',
					content: 'abc'
				},
				'> def'
			]
		)
	})

	it('should remove empty parts', () => {
		dropQuoteMarkerTest(
			[
				{
					type: 'text',
					style: 'bold',
					content: [
						{
							type: 'text',
							style: 'italic',
							content: '>   '
						}
					]
				},
				'def'
			],
			[
				'def'
			]
		)
		dropQuoteMarkerTest(
			[
				{
					type: 'text',
					style: 'bold',
					content: [
						{
							type: 'text',
							style: 'italic',
							content: [
								{
									type: 'text',
									style: 'bold',
									content: '>'
								},
								'abc'
							]
						}
					]
				},
				'def'
			],
			[
				{
					type: 'text',
					style: 'bold',
					content: [
						{
							type: 'text',
							style: 'italic',
							content: 'abc'
						}
					]
				},
				'def'
			]
		)
	})
})

