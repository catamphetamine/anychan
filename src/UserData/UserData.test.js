import { describe, it } from 'webapp-frontend/src/utility/mocha'
import expectToEqual from 'webapp-frontend/src/utility/expectToEqual'

import { UserData } from './UserData'
import MemoryStorage from 'webapp-frontend/src/utility/MemoryStorage'

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
		userData.addReadComments('a', 123, 124)
		userData.addReadComments('a', 456, 456)
		userData.addReadComments('a', 456, 457)
		userData.addReadComments('b', 789, 790)
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
				readComments: {
					a: {
						'123': 124,
						'456': 457
					},
					b: {
						'789': 790
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
				readComments: {
					a: {
						'456': 457
					},
					b: {
						'789': 790
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
})