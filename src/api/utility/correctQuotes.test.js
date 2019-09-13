import { describe, it } from 'webapp-frontend/src/utility/mocha'
import expectToEqual from 'webapp-frontend/src/utility/expectToEqual'

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