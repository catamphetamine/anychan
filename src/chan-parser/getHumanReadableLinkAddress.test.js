import { describe, it } from './mocha'
import expectToEqual from './expectToEqual'
import getHumanReadableLinkAddress from './getHumanReadableLinkAddress'

describe('getHumanReadableLinkAddress', () => {
	it('should get human-readable link address', () => {
		expectToEqual(
			getHumanReadableLinkAddress('http://youtube.org'),
			'youtube.org'
		)

		expectToEqual(
			getHumanReadableLinkAddress('https://youtube.org'),
			'youtube.org'
		)

		expectToEqual(
			getHumanReadableLinkAddress('https://www.youtube.org'),
			'youtube.org'
		)
	})
})