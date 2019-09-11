import { describe, it } from '../../../utility/mocha'
import expectToEqual from '../../../utility/expectToEqual'

import correctGrammar from './correctGrammar'

describe('correctGrammar', () => {
	it('should correct grammar', () => {
		expectToEqual(
			correctGrammar('a,b ,c , d, e -- f - g'),
			'a, b, c, d, e — f — g'
		)

		expectToEqual(
			correctGrammar('раз.Два'),
			'раз. Два'
		)

		expectToEqual(
			correctGrammar('раз(два)'),
			'раз (два)'
		)

		expectToEqual(
			correctGrammar('раз?(два)'),
			'раз? (два)'
		)

		expectToEqual(
			correctGrammar('"раз"(два)'),
			'«раз» (два)'
		)

		expectToEqual(
			correctGrammar('" раз "'),
			'«раз»'
		)
	})
})
