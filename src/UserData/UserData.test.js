import { describe, it } from 'webapp-frontend/src/utility/mocha'
import expectToEqual from 'webapp-frontend/src/utility/expectToEqual'

import { UserData } from './UserData'
import MemoryStorage from 'webapp-frontend/src/utility/storage/MemoryStorage'

const storage = new MemoryStorage({
	emulateSerialize: true
})
const userData = new UserData(storage, {
	prefix: ''
})

describe('UserData', () => {
	it('should add to / remove from index when adding to / removing from data collection', () => {
		storage.clear()
		userData.addTrackedThreadsList({
			id: 123,
			title: 'Anime 1',
			board: { id: 'a' }
		})
		userData.addTrackedThreadsList({
			id: 456,
			title: 'Anime 2',
			board: { id: 'a' }
		})
		userData.addTrackedThreadsList({
			id: 789,
			title: 'Random',
			board: { id: 'b' }
		})
		expectToEqual(
			storage.data,
			{
				trackedThreads: {
					a: [
						123,
						456
					],
					b: [
						789
					]
				},
				trackedThreadsList: [
					{
						id: 123,
						title: 'Anime 1',
						board: {
							id: 'a'
						}
					},
					{
						id: 456,
						title: 'Anime 2',
						board: {
							id: 'a'
						}
					},
					{
						id: 789,
						title: 'Random',
						board: {
							id: 'b'
						}
					}
				]
			}
		)
		userData.removeTrackedThreadsList({
			id: 123,
			board: {
				id: 'a'
			}
		})
		expectToEqual(
			storage.data,
			{
				trackedThreads: {
					a: [
						456
					],
					b: [
						789
					]
				},
				trackedThreadsList: [
					{
						id: 456,
						title: 'Anime 2',
						board: {
							id: 'a'
						}
					},
					{
						id: 789,
						title: 'Random',
						board: {
							id: 'b'
						}
					}
				]
			}
		)
	})

	it('should clear data on thread expiration', () => {
		storage.clear()
		// userData.addTrackedThreads('a', 123, { title: 'Anime 1' })
		// userData.addTrackedThreads('a', 456, { title: 'Anime 2' })
		// userData.addTrackedThreads('b', 789, { title: 'Random' })
		userData.addTrackedThreadsList({
			id: 123,
			title: 'Anime 1',
			board: { id: 'a' }
		})
		userData.addTrackedThreadsList({
			id: 456,
			title: 'Anime 2',
			board: { id: 'a' }
		})
		userData.addTrackedThreadsList({
			id: 789,
			title: 'Random',
			board: { id: 'b' }
		})
		userData.addLatestReadComments('a', 123, { id: 124, threadUpdatedAt: 1000 })
		userData.addLatestReadComments('a', 456, { id: 456, threadUpdatedAt: 2000 })
		userData.addLatestReadComments('a', 456, { id: 457, threadUpdatedAt: 3000 })
		userData.addLatestReadComments('b', 789, { id: 790, threadUpdatedAt: 4000 })
		userData.addHiddenComments('a', 123, 124)
		userData.addHiddenComments('a', 123, 125)
		userData.addHiddenComments('a', 456, 456)
		userData.addHiddenComments('a', 456, 457)
		userData.addHiddenComments('b', 789, 790)
		userData.addCommentVotes('a', 123, 124, 1)
		userData.addCommentVotes('a', 456, 456, 1)
		userData.addCommentVotes('b', 789, 790, -1)
		expectToEqual(
			storage.data,
			{
				trackedThreads: {
					a: [
						123,
						456
					],
					b: [
						789
					]
				},
				trackedThreadsList: [
					{
						id: 123,
						title: 'Anime 1',
						board: {
							id: 'a'
						}
					},
					{
						id: 456,
						title: 'Anime 2',
						board: {
							id: 'a'
						}
					},
					{
						id: 789,
						title: 'Random',
						board: {
							id: 'b'
						}
					}
				],
				latestReadComments: {
					a: {
						'123': {
							id: 124,
							t: 1
						},
						'456': {
							id: 457,
							t: 3
						}
					},
					b: {
						'789': {
							id: 790,
							t: 4
						}
					}
				},
				hiddenComments: {
					a: {
						'123': [
							124,
							125
						],
						'456': [
							456,
							457
						]
					},
					b: {
						'789': [
							790
						]
					}
				},
				commentVotes: {
					a: {
						'123': {
							'124': 1
						},
						'456': {
							'456': 1
						}
					},
					b: {
						'789': {
							'790': -1
						}
					}
				}
			}
		)
		userData.updateThreads('a', [{ id: 456 }])
		expectToEqual(
			storage.data,
			{
				trackedThreads: {
					a: [
						456
					],
					b: [
						789
					]
				},
				trackedThreadsList: [
					{
						id: 123,
						title: 'Anime 1',
						board: {
							id: 'a'
						},
						expired: true
					},
					{
						id: 456,
						title: 'Anime 2',
						board: {
							id: 'a'
						}
					},
					{
						id: 789,
						title: 'Random',
						board: {
							id: 'b'
						}
					}
				],
				latestReadComments: {
					a: {
						'456': {
							id: 457,
							t: 3
						}
					},
					b: {
						'789': {
							id: 790,
							t: 4
						}
					}
				},
				hiddenComments: {
					a: {
						'456': [
							456,
							457
						]
					},
					b: {
						'789': [
							790
						]
					}
				},
				commentVotes: {
					a: {
						'456': {
							'456': 1
						}
					},
					b: {
						'789': {
							'790': -1
						}
					}
				}
			}
		)
	})

	it('should merge user data', () => {
		storage.clear()
		userData.addTrackedThreadsList({
			id: 123,
			title: 'Anime 1',
			board: { id: 'a' }
		})
		userData.addTrackedThreadsList({
			id: 456,
			title: 'Anime 2',
			board: { id: 'a' }
		})
		// Create merged dataset.
		const storage2 = new MemoryStorage({
			emulateSerialize: true
		})
		const userData2 = new UserData(storage2, {
			prefix: ''
		})
		userData2.addTrackedThreadsList({
			id: 789,
			title: 'Random',
			board: { id: 'b' }
		})
		userData.merge(userData2.get())
		// Validate merge results.
		expectToEqual(
			storage.data,
			{
				trackedThreads: {
					a: [
						123,
						456
					],
					b: [
						789
					]
				},
				trackedThreadsList: [
					{
						id: 123,
						title: 'Anime 1',
						board: {
							id: 'a'
						}
					},
					{
						id: 456,
						title: 'Anime 2',
						board: {
							id: 'a'
						}
					},
					{
						id: 789,
						title: 'Random',
						board: {
							id: 'b'
						}
					}
				]
			}
		)
	})
})