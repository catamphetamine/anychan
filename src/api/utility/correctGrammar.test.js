import { describe, it } from 'webapp-frontend/src/utility/mocha'
import expectToEqual from 'webapp-frontend/src/utility/expectToEqual'

import _correctGrammar from './correctGrammar'

function correctGrammarEn(text) {
	return _correctGrammar(text, { language: 'en' })
}

function correctGrammarRu(text) {
	return _correctGrammar(text, { language: 'ru' })
}

describe('correctGrammar', () => {
	it('should correct grammar', () => {
		expectToEqual(
			correctGrammarEn('a,b ,c , d, e -- f - g'),
			'a, b, c, d, e — f — g'
		)

		expectToEqual(
			correctGrammarRu('раз.Два'),
			'раз. Два'
		)

		expectToEqual(
			correctGrammarRu('раз(два)'),
			'раз (два)'
		)

		expectToEqual(
			correctGrammarRu('раз?(два)'),
			'раз? (два)'
		)

		expectToEqual(
			correctGrammarRu('"раз"(два)'),
			'"раз" (два)'
		)
	})
})
