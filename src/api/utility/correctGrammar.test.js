import { describe, it } from 'webapp-frontend/src/utility/mocha'
import expectToEqual from 'webapp-frontend/src/utility/expectToEqual'

import _correctGrammar from './correctGrammar'

function correctGrammar(text) {
	return _correctGrammar(text, { language: 'ru' })
}

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
