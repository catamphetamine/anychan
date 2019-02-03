import { describe, it } from './mocha'
import expectToEqual from './expectToEqual'
import getHumanReadableLinkAddress from './getHumanReadableLinkAddress'

describe('getHumanReadableLinkAddress', () => {
	it('should get human-readable link address', () => {
		expectToEqual(
			getHumanReadableLinkAddress('http://youtube.com'),
			'youtube.com'
		)

		expectToEqual(
			getHumanReadableLinkAddress('https://youtube.com'),
			'youtube.com'
		)

		expectToEqual(
			getHumanReadableLinkAddress('https://www.youtube.com'),
			'youtube.com'
		)
	})
})