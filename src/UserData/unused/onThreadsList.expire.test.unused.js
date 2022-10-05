import onThreadsList from './onThreadsList'
import UserData from './UserData'
import { MemoryStorage } from 'web-browser-storage'

function create() {
	const storage = new MemoryStorage()
	const userData = new UserData(storage)
	return { storage, userData }
}

describe('UserData/onThreadsList', () => {
	it('should clear expired threads', () => {
		const { storage, userData } = create()

		// Add subscribed threads.

		userData.addSubscribedThread({
			id: 100,
			channel: { id: 'a' },
			title: 'Anime 1',
			addedAt: new Date(1000),
			latestComment: {
				id: 101,
				createdAt: new Date(2000)
			}
		})

		userData.addSubscribedThread({
			id: 200,
			channel: { id: 'a' },
			title: 'Anime 2',
			addedAt: new Date(1000),
			latestComment: {
				id: 201,
				createdAt: new Date(2000)
			}
		})

		// Add miscellaneous thread data.
		userData.addHiddenComment('a', 100, 101)
		userData.addHiddenComment('a', 200, 201)

		userData.addHiddenThread('a', 100)

		userData.setLatestReadCommentId('a', 100, 101)

		userData.addOwnThread('a', 100)
		userData.addOwnThread('c', 500)

		userData.addOwnComment('a', 100, 100)
		userData.addOwnComment('a', 100, 102)
		userData.addOwnComment('c', 500, 500)

		userData.setCommentVote('a', 100, 101, 1)
		userData.setCommentVote('a', 100, 102, -1)

		userData.setLatestSeenThreadId('a', 100)

		userData.addFavoriteChannel({ id: 'a' })
		userData.addFavoriteChannel({ id: 'b' })
		userData.addFavoriteChannel({ id: 'c' })

		// Validate storage data.
		expectToEqual(storage.getData(), {
			favoriteChannels: [
				{ id: 'a' },
				{ id: 'b' },
				{ id: 'c' }
			],
			latestSeenThreads: {
				a: 100
			},
			commentVotes: {
				a: {
					'100': {
						'101': 1,
						'102': -1
					}
				}
			},
			ownThreads: {
				a: [100],
				c: [500]
			},
			ownComments: {
				a: {
					'100': [102]
				}
			},
			hiddenComments: {
				a: {
					'100': [101],
					'200': [201]
				}
			},
			hiddenThreads: {
				a: [100]
			},
			latestReadComments: {
				a: {
					'100': 101
				}
			},
			subscribedThreadsIndex: {
				a: [100, 200]
			},
			subscribedThreads: [
				{
					id: 100,
					channel: { id: 'a' },
					title: 'Anime 1',
					addedAt: 1,
					latestComment: {
						id: 101,
						t: 2
					}
				},
				{
					id: 200,
					channel: { id: 'a' },
					title: 'Anime 2',
					addedAt: 1,
					latestComment: {
						id: 201,
						t: 2
					}
				}
			]
		})

		// Unrelated board — no threads affected.
		onThreadsList('b', [], { userData })

		// No changes to the storage data.
		expectToEqual(storage.getData().subscribedThreadsIndex, {
			a: [100, 200]
		})

		// Expire some threads.
		onThreadsList('a', [{ id: 200 }, { id: 300 }], {
			now: 3000,
			userData
		})

		// Validate storage data.
		expectToEqual(storage.getData(), {
			favoriteChannels: [
				{ id: 'a' },
				{ id: 'b' },
				{ id: 'c' }
			],
			ownThreads: {
				c: [500]
			},
		  ownComments: {},
		  hiddenThreads: {},
			hiddenComments: {
				a: {
					'200': [201]
				}
			},
			// This one shouldn't be cleared.
			latestSeenThreads: {
				a: 100
			},
		  latestReadComments: {},
			commentVotes: {},
			subscribedThreadsIndex: {
				a: [200]
			},
			subscribedThreads: [
				{
					id: 100,
					channel: { id: 'a' },
					title: 'Anime 1',
					addedAt: 1,
					expired: true,
					expiredAt: 3,
					latestComment: {
						id: 101,
						t: 2
					}
				},
				{
					id: 200,
					channel: { id: 'a' },
					title: 'Anime 2',
					addedAt: 1,
					latestComment: {
						id: 201,
						t: 2
					}
				}
			]
		})
	})
})