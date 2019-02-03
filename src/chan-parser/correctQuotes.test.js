import { describe, it } from './mocha'
import expectToEqual from './expectToEqual'
import correctQuotes from './correctQuotes'

describe('correctQuotes', () => {
	it('should correct quotes', () => {
		expectToEqual(
			correctQuotes('""'),
			'""'
		)

		expectToEqual(
			correctQuotes('"раз"(два)'),
			'«раз»(два)'
		)

		expectToEqual(
			correctQuotes('" раз "'),
			'«раз»'
		)

		expectToEqual(
			correctQuotes('" раз "два"'),
			'" раз "два"'
		)

		expectToEqual(
			correctQuotes('" раз "два""'),
			'" раз "два""'
		)
	})
})