import UserData from './UserData.js'
import { MemoryStorage } from 'web-browser-storage'

describe('UserData', () => {
	it('should handle onExternalChange (key matches a collection)', () => {
		const baseStorage = new MemoryStorage()
		const storage1 = baseStorage.createSharedInstance('1')
		const storage2 = baseStorage.createSharedInstance('2')

		const userData = new UserData(storage1, { prefix: 'prefix.' })

		let callCount = 0
		userData.onExternalChange(({
			collection,
			metadata
		}) => {
			callCount++
			expectToEqual(collection.name, 'hiddenComments')
			expectToEqual(metadata, {
				channelId: 'a',
				threadId: 123
			})
		})

		// Called: storage data got changed by a User Data action.
		userData.addHiddenComment('a', 123, 124)
		expectToEqual(callCount, 0)

		// Not called: prefix doesn't match.
		storage2.set('🤫/a/123', 124)
		expectToEqual(callCount, 0)

		// Called: prefix matches.
		storage2.set('prefix.🤫/a/123', 124)
		expectToEqual(callCount, 1)
	})

	it('should handle onChange (key doesn\'t match any collection)', () => {
		const baseStorage = new MemoryStorage()
		const storage1 = baseStorage.createSharedInstance('1')
		const storage2 = baseStorage.createSharedInstance('2')

		const userData = new UserData(storage1)

		let called = false
		userData.onExternalChange(() => {
			called = true
		})

		// Not called: unrelated key value has changed.
		storage2.set('someKey')
		expectToEqual(called, false)
	})
})