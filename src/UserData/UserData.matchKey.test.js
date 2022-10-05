import UserData from './UserData.js'
import { MemoryStorage } from 'web-browser-storage'

describe('UserData', () => {
	it('should match a key against collections', () => {
		const storage = new MemoryStorage()
		const userData = new UserData(storage)

		expectToEqual(userData.matchKey('favoriteChannels'), undefined)
		expectToEqual(userData.matchKey('📚'), {
			collectionName: 'favoriteChannels',
			metadata: {}
		})
		expectToEqual(userData.matchKey('📚/a'), undefined)

		expectToEqual(userData.matchKey('hiddenThreads'), undefined)
		expectToEqual(userData.matchKey('hiddenThreads/a'), undefined)
		expectToEqual(userData.matchKey('😷'), undefined)
		expectToEqual(userData.matchKey('😷/a'), {
			collectionName: 'hiddenThreads',
			metadata: {
				channelId: 'a'
			}
		})

		expectToEqual(userData.matchKey('😷/a/123'), undefined)

		expectToEqual(userData.matchKey('hiddenComments'), undefined)
		expectToEqual(userData.matchKey('hiddenComments/a'), undefined)
		expectToEqual(userData.matchKey('hiddenComments/a/123'), undefined)
		expectToEqual(userData.matchKey('🤫'), undefined)
		expectToEqual(userData.matchKey('🤫/a'), undefined)
		expectToEqual(userData.matchKey('🤫/a/123'), {
			collectionName: 'hiddenComments',
			metadata: {
				channelId: 'a',
				threadId: 123
			}
		})
	})
})