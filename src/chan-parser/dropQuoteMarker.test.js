import { describe, it } from './mocha'
import expectToEqual from './expectToEqual'
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
})

