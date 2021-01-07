import { describe, it } from 'webapp-frontend/src/utility/mocha'
import expectToEqual from 'webapp-frontend/src/utility/expectToEqual'

import replaceQuotes from './replaceQuotes'

function replaceQuotesRu(text) {
	return replaceQuotes(text, { language: 'ru' })
}

describe('replaceQuotes', () => {
	it('should replace quotes', () => {
		expectToEqual(
			replaceQuotesRu('""'),
			'""'
		)

		expectToEqual(
			replaceQuotesRu('"раз"(два)'),
			'«раз»(два)'
		)

		expectToEqual(
			replaceQuotesRu('" раз "'),
			'«раз»'
		)

		expectToEqual(
			replaceQuotesRu('" раз "два"'),
			'" раз "два"'
		)

		expectToEqual(
			replaceQuotesRu('" раз "два""'),
			'" раз "два""'
		)

		expectToEqual(
			replaceQuotesRu('" раз "'),
			'«раз»'
		)
	})
})