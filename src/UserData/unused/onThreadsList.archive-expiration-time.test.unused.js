import onThreadsList from './onThreadsList'
import UserData from './UserData'
import { MemoryStorage } from 'web-browser-storage'

function create() {
	const storage = new MemoryStorage()
	const userData = new UserData(storage)
	return { storage, userData }
}

describe('UserData/onThreadsList', () => {
	it('should expire threads in archive when archiving threads', () => {
		const { storage, userData } = create()

		// Add archived thread.
		storage.set('archive.archivedThreads', {
			a: {
				'100': {
					t: 1
				}
			}
		})

		// Add archived thread data.
		storage.set('archive.hiddenComments', {
			a: {
				'100': [102]
			}
		})

		// Add miscellaneous thread data.
		userData.addHiddenComment('a', 100, 101)

		// Expire thread.
		onThreadsList('a', [], {
			now: 3000,
			userData,
			threadArchive: true,
			threadArchiveLifetime: 1000
		})

		// Validate storage data.
		expectToEqual(storage.getData(), {
			'archive.archivedThreads': {},
			'archive.hiddenComments': {},
			hiddenComments: {}
		})
	})
})