import { describe, it } from 'webapp-frontend/src/utility/mocha'
import expectToEqual from 'webapp-frontend/src/utility/expectToEqual'

import { UserData } from './UserData'
import MemoryStorage from '../utility/MemoryStorage'

const storage = new MemoryStorage()
const userData = new UserData(storage)
userData.prefix = ''

describe('UserData', () => {
	it('should also remove from "data" key when removing from key', () => {
		storage.clear()
		userData.addWatchedThreads('a', 123)
		userData.addWatchedThreadsInfo('a', 123, {
			subject: 'Anime'
		})
		expectToEqual(
			storage.data,
			{
				watchedThreads: {
					a: [
						123
					]
				},
				watchedThreadsInfo: {
					a: {
						'123': {
							subject: 'Anime'
						}
					}
				}
			}
		)
		userData.removeWatchedThreads('a', 123)
		expectToEqual(
			storage.data,
			{}
		)
	})

	it('should clear data on thread expiration', () => {
		storage.clear()
		userData.addWatchedThreads('a', 123)
		userData.addWatchedThreads('a', 456)
		userData.addWatchedThreads('b', 789)
		userData.addWatchedThreadsInfo('a', 123, { name: 'Anime 1' })
		userData.addWatchedThreadsInfo('a', 456, { name: 'Anime 2' })
		userData.addWatchedThreadsInfo('b', 789, { name: 'Random' })
		userData.addReadComments('a', 123, 124)
		userData.addReadComments('a', 456, 456)
		userData.addReadComments('a', 456, 457)
		userData.addReadComments('b', 789, 790)
		userData.addOwnComments('a', 123, 124)
		userData.addOwnComments('a', 123, 125)
		userData.addOwnComments('a', 456, 456)
		userData.addOwnComments('a', 456, 457)
		userData.addOwnComments('b', 789, 790)
		expectToEqual(
			storage.data,
			{
				watchedThreads: {
					a: [
						123,
						456
					],
					b: [
						789
					]
				},
				watchedThreadsInfo: {
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
				}
			}
		)
		userData.updateThreads('a', [{ id: 456 }])
		expectToEqual(
			storage.data,
			{
				watchedThreads: {
					a: [
						123,
						456
					],
					b: [
						789
					]
				},
				watchedThreadsInfo: {
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
				}
			}
		)
	})
})