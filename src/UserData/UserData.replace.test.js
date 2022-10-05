import UserData from './UserData.js'
import { MemoryStorage } from 'web-browser-storage'

describe('UserData', () => {
	it('should replace User Data', () => {
		const storage = new MemoryStorage()
		const userData = new UserData(storage)

		// Add favorite channels.
		userData.addFavoriteChannel({ id: 'a', title: 'Anime 1' })
		userData.addFavoriteChannel({ id: 'c', title: 'Common' })

		// Add current threads.
		userData.setThreads('a', [101, 102, 103])
		userData.setThreads('c', [301, 302, 303])

		// Set threads access time.
		userData.setThreadAccessedAt('a', 110, new Date(86400000))
		userData.setThreadAccessedAt('c', 300, new Date(86400000))

		// Own threads
		userData.addOwnThread('a', 110)

		// Own threads
		userData.addOwnComment('a', 110, 110)

		// Hide comments.
		userData.addHiddenComment('a', 110, 112)
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

		// Replace User Data.
		userData.replace({
			version: 5,
			favoriteChannels: [
				{ id: 'a', title: 'Anime 2' },
				{ id: 'b', title: 'Random' }
			],
			threads: {
				a: [103, 104],
				c: [301, 304]
			},
			hiddenComments: {
				a: {
					'110': [113],
					'120': [121, 122]
				},
				b: {
					'200': [200]
				}
			},
			hiddenThreads: {
				a: [110, 130]
			},
			ownThreads: {
				a: [130]
			},
			ownComments: {
				a: {
					'130': [130]
				}
			},
			threadsAccessedAt: {
				a: {
					'130': 1
				}
			},
			subscribedThreadsIndex: {
				a: [123],
				b: [789]
			},
			subscribedThreads: [
				// This is a stale version of this thread.
				{
					id: 123,
					title: 'Anime 1',
					channel: { id: 'a' },
					addedAt: 1
				},
				// This thread wasn't present.
				{
					id: 789,
					title: 'Random',
					channel: { id: 'b' },
					addedAt: 1
				}
			]
		})

		// Validate data.
		expectToEqual(userData.get(), {
			favoriteChannels: [
				{ id: 'a', title: 'Anime 2' },
				{ id: 'b', title: 'Random' }
			],
			threads: {
				a: [103, 104],
				c: [301, 304]
			},
			hiddenComments: {
				a: {
					'110': [113],
					'120': [121, 122]
				},
				b: {
					'200': [200]
				}
			},
			hiddenThreads: {
				a: [110, 130]
			},
			ownThreads: {
				a: [130]
			},
			ownComments: {
				a: {
					'130': [130]
				}
			},
			threadsAccessedAt: {
				a: {
					'130': 1
				}
			},
			subscribedThreadsIndex: {
				a: [123],
				b: [789]
			},
			subscribedThreads: [{
				id: 123,
				title: 'Anime 1',
				channel: { id: 'a' },
				addedAt: 1
			}, {
				id: 789,
				title: 'Random',
				channel: { id: 'b' },
				addedAt: 1
			}]
		})
	})
})