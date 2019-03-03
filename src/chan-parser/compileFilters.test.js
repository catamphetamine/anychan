import { describe, it } from './mocha'
import expectToEqual from './expectToEqual'
import compileFilters from './compileFilters'

describe('compileFilters', () => {
	it('should expand ^ and $ and .', () => {
		const filters = compileFilters(['^a.b$'], 'en')
		expectToEqual(filters.length, 4)

		expectFilterToEqual(filters.pop(), {
			includesWordStart: true,
			includesWordEnd: true,
			regexp: '/[^a-z]a[a-z]b[^a-z]/i'
		})

		expectFilterToEqual(filters.pop(), {
			includesWordStart: true,
			includesWordEnd: false,
			regexp: '/[^a-z]a[a-z]b$/i'
		})

		expectFilterToEqual(filters.pop(), {
			includesWordStart: false,
			includesWordEnd: true,
			regexp: '/^a[a-z]b[^a-z]/i'
		})

		expectFilterToEqual(filters.pop(), {
			includesWordStart: false,
			includesWordEnd: false,
			regexp: '/^a[a-z]b$/i'
		})
	})
})

function expectFilterToEqual(filter, expected) {
	expectToEqual(filter.includesWordStart, expected.includesWordStart)
	expectToEqual(filter.includesWordEnd, expected.includesWordEnd)
	expectToEqual(filter.regexp.toString(), expected.regexp)
}