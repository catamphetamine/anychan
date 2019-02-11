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

	it('should substitute common web services names', () => {
		expectToEqual(
			getHumanReadableLinkAddress('https://discord.gg/2HPKEW'),
			'Discord/2HPKEW'
		)

		expectToEqual(
			getHumanReadableLinkAddress('https://instagram.com/modoku._/'),
			'Instagram/modoku._'
		)

		expectToEqual(
			getHumanReadableLinkAddress('https://www.facebook.com/profile.php?id=100006433235253'),
			'Facebook/100006433235253'
		)

		expectToEqual(
			getHumanReadableLinkAddress('https://www.facebook.com/durov'),
			'Facebook/durov'
		)

		expectToEqual(
			getHumanReadableLinkAddress('https://vk.com/name'),
			'VK/name'
		)

		expectToEqual(
			getHumanReadableLinkAddress('https://vk.com/id12345'),
			'VK/12345'
		)

		expectToEqual(
			getHumanReadableLinkAddress('https://www.youtube.com/watch?v=0P8b81M9OWw'),
			'YouTube/0P8b81M9OWw'
		)

		expectToEqual(
			getHumanReadableLinkAddress('https://www.youtube.com/user/ChristopherOdd'),
			'YouTube/ChristopherOdd'
		)

		expectToEqual(
			getHumanReadableLinkAddress('https://www.youtube.com/user/ChristopherOdd/videos'),
			'YouTube/ChristopherOdd'
		)
	})
})