import UserData from './UserData.js'
import { MemoryStorage } from 'web-browser-storage'

describe('UserData', () => {
	it('should merge User Data', () => {
		const storage = new MemoryStorage()
		const userData = new UserData(storage)

		// Add threads.
		userData.setThreads('a', [101, 102, 103])
		userData.setThreads('c', [302, 303])

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
		userData.addOwnThread('a', 120)

		// Own comments.
		userData.addOwnComment('a', 110, 110)
		userData.addOwnComment('a', 120, 120)

		// Hide comments.
		userData.addHiddenComment('a', 110, 112)
		userData.addHiddenComment('b', 200, 201)
		userData.addHiddenComment('c', 300, 301)

		// Hide threads.
		userData.addHiddenThread('a', 110)

		// Ignored authors.
		userData.addIgnoredAuthor('a1b2c3')

		// Announcement.
		// A merged one overrides an existing one.
		userData.setAnnouncement({ date: '2012-12-21T00:00:00.000Z', content: 'Test 1' })

		// Latest read comment.
		// A record with a larger comment ID overrides
		// the one with a smaller comment ID.
		userData.setLatestReadCommentId('a', 110, 111)

		// Newer thread votes will override the old ones.
		userData.setThreadVote('a', 110, -1)

		// Newer comment votes will override the old ones.
		userData.setCommentVote('a', 110, 110, -1)
		userData.setCommentVote('a', 110, 111, -1)

		// Later "latest seen" thread ID will override
		// an earlier one.
		userData.setLatestSeenThreadId('a', 111)

		// Add subscribed thread.
		// This is the latest version of this thread.
		userData.addSubscribedThread({
			id: 123,
			title: 'Apple',
			channel: { id: 'a', title: 'Anime' },
			addedAt: new Date(1000)
		})
		userData.addSubscribedThreadIdForChannel('a', 123)

		// Add subscribed thread.
		userData.addSubscribedThread({
			id: 131,
			title: 'Birdberry',
			channel: { id: 'a', title: 'Anime' },
			addedAt: new Date(1000)
		})
		userData.addSubscribedThreadIdForChannel('a', 131)

		// Add subscribed thread.
		userData.addSubscribedThread({
			id: 141,
			title: 'Cherry',
			channel: { id: 'a', title: 'Anime' },
			// The existing subscribed thread has a later `addedAt` timestamp
			// compared to the one that will be merged with it later.
			addedAt: new Date(2000)
		})
		userData.addSubscribedThreadIdForChannel('a', 141)

		// Add subscribed thread.
		userData.addSubscribedThread({
			id: 456,
			title: 'Date',
			channel: { id: 'a', title: 'Anime' },
			addedAt: new Date(1000)
		})
		userData.addSubscribedThreadIdForChannel('a', 456)

		// Merge User Data.
		userData.merge({
			version: 5,
			favoriteChannels: [
				// Another title of `/a/` board.
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
					'200': [201]
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
			ignoredAuthors: ['d4e5f6'],
			threadsAccessedAt: {
				a: {
					'110': 2,
					'130': 1
				}
			},
			latestReadComments: {
				a: {
					'110': 110
				}
			},
			latestSeenThreads: {
				a: 110
			},
			threadVotes: {
				a: {
					'110': 1
				}
			},
			commentVotes: {
				a: {
					'110': {
						'111': 1
					}
				}
			},
			subscribedThreadsIndex: {
				a: [123],
				b: [789]
			},
			subscribedThreads: [
				// This is a stale version of this thread.
				// Doesn't have a `updatedAt` timestamp.
				// The existing thread does have a `updatedAt` timestamp.
				{
					id: 123,
					title: 'Apple',
					channel: { id: 'a', title: 'Anime' },
					addedAt: 1,
					updatedAt: 2
				},
				// This is a stale version of this thread.
				// The existing thread has a later `updatedAt` timestamp.
				{
					id: 131,
					title: 'Birdberry',
					channel: { id: 'a', title: 'Anime' },
					addedAt: 1,
					updatedAt: 2
				},
				// This is a stale version of this thread.
				// The existing thread has later `addedAt` timestamp.
				{
					id: 141,
					title: 'Cherry',
					channel: { id: 'a', title: 'Anime' },
					addedAt: 1
				},
				// This thread wasn't present.
				// It will be added as a result of the merge.
				{
					id: 789,
					title: 'Random',
					channel: { id: 'b', title: 'Random' },
					addedAt: 1
				}
			],
			announcement: {
				date: '2012-12-21T00:00:00.000Z',
				content: 'Test 2'
			}
		})

		// Validate storage data.
		expectToEqual(userData.get(), {
			favoriteChannels: [
				{ id: 'a', title: 'Anime 1' },
				{ id: 'c', title: 'Common' },
				{ id: 'b', title: 'Random' }
			],
			threads: {
				a: [101, 102, 103, 104],
				c: [301, 302, 303, 304]
			},
			hiddenComments: {
				a: {
					'110': [112, 113],
					'120': [121, 122]
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
				a: [110, 120, 130]
			},
			ownComments: {
				a: {
					'110': [110],
					'120': [120],
					'130': [130]
				}
			},
			ignoredAuthors: ['a1b2c3', 'd4e5f6'],
			threadsAccessedAt: {
				a: {
					'110': 2,
					'130': 1
				},
				c: {
					'300': 1
				}
			},
			latestReadComments: {
				a: {
					'110': 111
				}
			},
			latestSeenThreads: {
				a: 111
			},
			threadVotes: {
				a: {
					'110': 1
				}
			},
			commentVotes: {
				a: {
					'110': {
						'110': -1,
						'111': 1
					}
				}
			},
			subscribedThreadsIndex: {
				a: [123, 131, 141, 456],
				b: [789]
			},
			subscribedThreads: [{
				id: 123,
				title: 'Apple',
				channel: { id: 'a', title: 'Anime' },
				addedAt: 1,
				updatedAt: 2
			}, {
				id: 131,
				title: 'Birdberry',
				channel: { id: 'a', title: 'Anime' },
				addedAt: 1,
				updatedAt: 2
			},
			// This thread has later `addedAt` timestamp.
			{
				id: 141,
				title: 'Cherry',
				channel: { id: 'a', title: 'Anime' },
				addedAt: 2
			}, {
				id: 456,
				title: 'Date',
				channel: { id: 'a', title: 'Anime' },
				addedAt: 1
			}, {
				id: 789,
				title: 'Random',
				channel: { id: 'b', title: 'Random' },
				addedAt: 1
			}],
			announcement: {
				date: '2012-12-21T00:00:00.000Z',
				content: 'Test 2'
			}
		})
	})
})