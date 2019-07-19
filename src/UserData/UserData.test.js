import { describe, it } from 'webapp-frontend/src/utility/mocha'
import expectToEqual from 'webapp-frontend/src/utility/expectToEqual'

import { UserData } from './UserData'
import MemoryStorage from 'webapp-frontend/src/utility/MemoryStorage'

const storage = new MemoryStorage()
const userData = new UserData(storage)
userData.prefix = ''

describe('UserData', () => {
	it('should clear data on thread expiration', () => {
		storage.clear()
		userData.addWatchedThreads('a', 123, { name: 'Anime 1' })
		userData.addWatchedThreads('a', 456, { name: 'Anime 2' })
		userData.addWatchedThreads('b', 789, { name: 'Random' })
		userData.addReadComments('a', 123, 124)
		userData.addReadComments('a', 456, 456)
		userData.addReadComments('a', 456, 457)
		userData.addReadComments('b', 789, 790)
		userData.addOwnComments('a', 123, 124)
		userData.addOwnComments('a', 123, 125)
		userData.addOwnComments('a', 456, 456)
		userData.addOwnComments('a', 456, 457)
		userData.addOwnComments('b', 789, 790)
		userData.addCommentVotes('a', 123, 124, 1)
		userData.addCommentVotes('a', 456, 456, 1)
		userData.addCommentVotes('b', 789, 790, -1)
		expectToEqual(
			storage.data,
			{
				watchedThreads: {
					a: {
						'123': {
							name: 'Anime 1'
						},
						'456': {
							name: 'Anime 2'
						}
					},
					b: {
						'789': {
							name: 'Random'
						}
					}
				},
				readComments: {
					a: {
						'123': 124,
						'456': 457
					},
					b: {
						'789': 790
					}
				},
				ownComments: {
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
				watchedThreads: {
					a: {
						'123': {
							name: 'Anime 1',
							expired: true
						},
						'456': {
							name: 'Anime 2'
						}
					},
					b: {
						'789': {
							name: 'Random'
						}
					}
				},
				readComments: {
					a: {
						'456': 457
					},
					b: {
						'789': 790
					}
				},
				ownComments: {
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