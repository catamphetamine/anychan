import UserData from './UserData.js'
import { MemoryStorage } from 'web-browser-storage'

describe('UserData', () => {
	it('should write data to the underlying storage', () => {
		const storage = new MemoryStorage()
		const userData = new UserData(storage)

		// Add favorite channels.
		userData.addFavoriteChannel({ id: 'a', title: 'Anime 1' })
		userData.addFavoriteChannel({ id: 'c', title: 'Common' })

		// Add current threads.
		userData.setThreads('a', [101, 102, 103])
		userData.setThreads('c', [301, 302, 303])

		// Add archived threads access time.
		userData.setThreadAccessedAt('a', 110, new Date(86400000))
		userData.setThreadAccessedAt('c', 300, new Date(86400000))

		// Own threads
		userData.addOwnThread('a', 110)

		// Own threads
		userData.addOwnComment('a', 110, 110)

		// Hide comments.
		userData.addHiddenComment('a', 110, 112)
		userData.addHiddenComment('a', 110, 113)
		userData.addHiddenComment('c', 300, 301)
		userData.addHiddenComment('b', 200, 201)

		// Hide threads.
		userData.addHiddenThread('a', 110)
		userData.addHiddenThread('a', 130)

		// Add subscribed thread.
		// This is the latest version of this thread.
		userData.addSubscribedThread({
			id: 123,
			title: 'Anime 1',
			channel: { id: 'a', title: 'Anime' },
			addedAt: new Date(1000)
		})
		userData.addSubscribedThreadIdForChannel('a', 123)

		// Add subscribed thread.
		userData.addSubscribedThread({
			id: 789,
			title: 'Random 1',
			channel: { id: 'b', title: 'Random' },
			addedAt: new Date(1000)
		})
		userData.addSubscribedThreadIdForChannel('b', 789)

		// Validate `storage` data.
		expectToEqual(storage.getData(), {
			'📚': [
				{ id: 'a', title: 'Anime 1' },
				{ id: 'c', title: 'Common' }
			],
			'📖/a': [101, 102, 103],
			'📖/c': [301, 302, 303],
			'🤫/a/110': [112, 113],
			'🤫/b/200': [201],
			'🤫/c/300': [301],
			'😷/a': [110, 130],
			'🗣️/a': [110],
			'✍️/a/110': [110],
			'📂/a/110': 1,
			'📂/c/300': 1,
			'🔖/a': [123],
			'🔖/b': [789],
			'📑': [
				{
					id: 123,
					title: 'Anime 1',
					channel: { id: 'a', title: 'Anime' },
					addedAt: 1
				},
				{
					id: 789,
					title: 'Random 1',
					channel: { id: 'b', title: 'Random' },
					addedAt: 1
				}
			]
		})
	})
})