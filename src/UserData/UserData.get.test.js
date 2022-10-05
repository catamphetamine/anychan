import UserData from './UserData.js'
import { MemoryStorage } from 'web-browser-storage'

describe('UserData', () => {
	it('should get User Data', () => {
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

		// Own threads.
		userData.addOwnThread('a', 110)

		// Own comments.
		userData.addOwnComment('a', 110, 110)

		// Hide comments.
		userData.addHiddenComment('a', 110, 112)
		userData.addHiddenComment('c', 300, 301)
		userData.addHiddenComment('b', 200, 201)

		// Hide threads.
		userData.addHiddenThread('a', 110)
		userData.addHiddenThread('a', 130)

		// Add subscribed thread.
		userData.addSubscribedThread({
			id: 123,
			title: 'Anime 1',
			channel: { id: 'a' },
			addedAt: new Date(1000)
		})

		// Add subscribed thread.
		userData.addSubscribedThread({
			id: 456,
			title: 'Anime 2',
			channel: { id: 'a' },
			addedAt: new Date(1000)
		})

		// Update subscribed threads index.
		userData.addSubscribedThreadIdForChannel('a', 123)
		userData.addSubscribedThreadIdForChannel('a', 456)

		// Validate `.get()` result.
		expectToEqual(userData.get(), {
			favoriteChannels: [
				{ id: 'a', title: 'Anime 1' },
				{ id: 'c', title: 'Common' }
			],
			threads: {
				a: [101, 102, 103],
				c: [301, 302, 303]
			},
			hiddenComments: {
				a: {
					'110': [112]
				},
				b: {
					'200': [201]
				},
				c: {
					'300': [301]
				}
			},
			hiddenThreads: {
				a: [110, 130]
			},
			ownThreads: {
				a: [110]
			},
			ownComments: {
				a: {
					'110': [110]
				}
			},
			threadsAccessedAt: {
				a: {
					'110': 1
				},
				c: {
					'300': 1
				}
			},
			subscribedThreadsIndex: {
				a: [123, 456]
			},
			subscribedThreads: [{
				id: 123,
				title: 'Anime 1',
				channel: { id: 'a' },
				addedAt: 1
			}, {
				id: 456,
				title: 'Anime 2',
				channel: { id: 'a' },
				addedAt: 1
			}]
		})
	})
})