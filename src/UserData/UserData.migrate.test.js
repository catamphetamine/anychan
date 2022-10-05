import UserData, { VERSION } from './UserData.js'
import { MemoryStorage } from 'web-browser-storage'

describe('UserData', function() {
	it('should migrate UserData', function() {
		const storage = new MemoryStorage()
		const userData = new UserData(storage)

		// `version: undefined` means "the initial version".
		storage.setData({
			favoriteBoards: [
				{ id: 'a', title: 'Anime' },
				{ id: 'b', title: 'Random' }
			],
			ownThreads: {
				a: [123, 200],
				b: [456]
			},
			ownComments: {
				a: {
					'123': [123, 124, 125],
					'200': [200, 201]
				},
				b: {
					'456': [456]
				}
			},
			commentVotes: {
				a: {
					'123': {
						'123': 1,
						'124': -1
					},
					'456': {
						'457': 1
					}
				}
			},
			latestReadComments: {
				a: {
					'123': 125,
					'456': 457
				}
			},
			// `subscribedThreadsIndex` collection was called `trackedThreads` before version 5.
			trackedThreads: {
				a: [123]
			},
			// `subscribedThreads` collection was called `trackedThreadsList` before version 5.
			trackedThreadsList: [{
				id: 123,
				board: {
					id: 'a',
					title: 'Anime'
				},
				expired: true,
				expiredAt: 123456791000,
				addedAt: 123456790000,
				latestComment: {
					id: 123,
					createdAt: 123456789000
				}
			}]
		})

		userData.requiresMigration().should.equal(true)

		userData.migrate()

		expectToEqual(
			userData.get(),
			{
				version: VERSION,
				favoriteChannels: [
					{ id: 'a', title: 'Anime' },
					{ id: 'b', title: 'Random' }
				],
				ownThreads: {
					a: [123, 200],
					b: [456]
				},
				ownComments: {
					a: {
						'123': [123, 124, 125],
						'200': [200, 201]
					},
					b: {
						'456': [456]
					}
				},
				threadVotes: {
					a: {
						'123': 1
					}
				},
				commentVotes: {
					a: {
						'123': {
							'124': -1
						},
						'456': {
							'457': 1
						}
					}
				},
				latestReadComments: {
					a: {
						'123': 125,
						'456': 457
					}
				},
				subscribedThreadsIndex: {
					a: [123]
				},
				subscribedThreads: [{
					id: 123,
					channel: {
						id: 'a',
						title: 'Anime'
					},
					expired: true,
					expiredAt: 123456791,
					addedAt: 123456790
				}],
				subscribedThreadsState: {
					'a': {
						'123': {
							refreshedAt: 123456790000,
							latestComment: {
								id: 123,
								createdAt: 123456790000
							},
							commentsCount: 1,
							newCommentsCount: 0,
							newRepliesCount: 0
						}
					}
				}
			}
		)
	})
})