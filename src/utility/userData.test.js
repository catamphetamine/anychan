import { describe, it } from 'webapp-frontend/src/utility/mocha'
import expectToEqual from 'webapp-frontend/src/utility/expectToEqual'

import { UserData } from './userData'
import MemoryStorage from './MemoryStorage'

const storage = new MemoryStorage()
const userData = new UserData(storage)
userData.prefix = ''

describe('userData', () => {
	it('should add/remove/get favorite boards', () => {
		storage.clear()
		userData.addFavoriteBoards('a')
		expectToEqual(
			storage.data,
			{
				favoriteBoards: [
					'a'
				]
			}
		)
		userData.addFavoriteBoards('b')
		expectToEqual(
			storage.data,
			{
				favoriteBoards: [
					'a',
					'b'
				]
			}
		)
		expectToEqual(
			userData.getFavoriteBoards(),
			[
				'a',
				'b'
			]
		)
		expectToEqual(
			userData.getFavoriteBoards('a'),
			true
		)
		expectToEqual(
			userData.getFavoriteBoards('c'),
			false
		)
		userData.removeFavoriteBoards('c')
		expectToEqual(
			storage.data,
			{
				favoriteBoards: [
					'a',
					'b'
				]
			}
		)
		userData.removeFavoriteBoards('b')
		expectToEqual(
			storage.data,
			{
				favoriteBoards: [
					'a'
				]
			}
		)
		userData.removeFavoriteBoards('a')
		expectToEqual(
			storage.data,
			{}
		)
	})

	it('should add/remove/get watched threads', () => {
		storage.clear()
		userData.addWatchedThreads('a', 123)
		expectToEqual(
			storage.data,
			{
				watchedThreads: {
					a: [
						123
					]
				}
			}
		)
		userData.addWatchedThreads('a', 456)
		expectToEqual(
			storage.data,
			{
				watchedThreads: {
					a: [
						123,
						456
					]
				}
			}
		)
		userData.addWatchedThreads('b', 789)
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
				}
			}
		)
		expectToEqual(
			userData.getWatchedThreads(),
			{
				a: [
					123,
					456
				],
				b: [
					789
				]
			}
		)
		expectToEqual(
			userData.getWatchedThreads('a'),
			[
				123,
				456
			]
		)
		expectToEqual(
			userData.getWatchedThreads('c'),
			[]
		)
		expectToEqual(
			userData.getWatchedThreads('a', 123),
			true
		)
		expectToEqual(
			userData.getWatchedThreads('a', 789),
			false
		)
		expectToEqual(
			userData.getWatchedThreads('c', 111),
			false
		)
		userData.removeWatchedThreads('b')
		expectToEqual(
			storage.data,
			{
				watchedThreads: {
					a: [
						123,
						456
					]
				}
			}
		)
		userData.removeWatchedThreads('b', 789)
		expectToEqual(
			storage.data,
			{
				watchedThreads: {
					a: [
						123,
						456
					]
				}
			}
		)
		userData.removeWatchedThreads('a', 123)
		expectToEqual(
			storage.data,
			{
				watchedThreads: {
					a: [
						456
					]
				}
			}
		)
		userData.removeWatchedThreads('a', 456)
		expectToEqual(
			storage.data,
			{}
		)
	})

	it('should add/remove/get read comments', () => {
		storage.clear()
		userData.addReadComments('a', 123, 124)
		expectToEqual(
			storage.data,
			{
				readComments: {
					a: {
						'123': 124
					}
				}
			}
		)
		userData.addReadComments('a', 123, 125)
		expectToEqual(
			storage.data,
			{
				readComments: {
					a: {
						'123': 125
					}
				}
			}
		)
		userData.addReadComments('a', 456, 456)
		expectToEqual(
			storage.data,
			{
				readComments: {
					a: {
						'123': 125,
						'456': 456
					}
				}
			}
		)
		userData.addReadComments('b', 789, 790)
		expectToEqual(
			storage.data,
			{
				readComments: {
					a: {
						'123': 125,
						'456': 456
					},
					b: {
						'789': 790
					}
				}
			}
		)
		expectToEqual(
			userData.getReadComments(),
			{
				a: {
					'123': 125,
					'456': 456
				},
				b: {
					'789': 790
				}
			}
		)
		expectToEqual(
			userData.getReadComments('b', 789, 790),
			true
		)
		expectToEqual(
			userData.getReadComments('b', 789, 791),
			false
		)
		expectToEqual(
			userData.getReadComments('b', 789),
			790
		)
		expectToEqual(
			userData.getReadComments('a'),
			{
				'123': 125,
				'456': 456
			}
		)
		expectToEqual(
			userData.getReadComments('c'),
			{}
		)
		expectToEqual(
			userData.getReadComments('c', 111),
			undefined
		)
		expectToEqual(
			userData.getReadComments('c', 111, 112),
			false
		)
		userData.removeReadComments('b')
		expectToEqual(
			storage.data,
			{
				readComments: {
					a: {
						'123': 125,
						'456': 456
					}
				}
			}
		)
		userData.removeReadComments('a', 456)
		expectToEqual(
			storage.data,
			{
				readComments: {
					a: {
						'123': 125
					}
				}
			}
		)
		userData.removeReadComments('a', 123)
		expectToEqual(
			storage.data,
			{}
		)
	})

	it('should add/remove/get own comments', () => {
		storage.clear()
		userData.addOwnComments('a', 123, 124)
		expectToEqual(
			storage.data,
			{
				ownComments: {
					a: {
						'123': [
							124
						]
					}
				}
			}
		)
		userData.addOwnComments('a', 123, 125)
		expectToEqual(
			storage.data,
			{
				ownComments: {
					a: {
						'123': [
							124,
							125
						]
					}
				}
			}
		)
		userData.addOwnComments('a', 456, 456)
		expectToEqual(
			storage.data,
			{
				ownComments: {
					a: {
						'123': [
							124,
							125
						],
						'456': [
							456
						]
					}
				}
			}
		)
		userData.addOwnComments('b', 789, 790)
		expectToEqual(
			storage.data,
			{
				ownComments: {
					a: {
						'123': [
							124,
							125
						],
						'456': [
							456
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
		expectToEqual(
			userData.getOwnComments(),
			{
				a: {
					'123': [
						124,
						125
					],
					'456': [
						456
					]
				},
				b: {
					'789': [
						790
					]
				}
			}
		)
		expectToEqual(
			userData.getOwnComments('b', 789, 790),
			true
		)
		expectToEqual(
			userData.getOwnComments('b', 789, 791),
			false
		)
		expectToEqual(
			userData.getOwnComments('b', 789),
			[790]
		)
		expectToEqual(
			userData.getOwnComments('a'),
			{
				'123': [
					124,
					125
				],
				'456': [
					456
				]
			}
		)
		expectToEqual(
			userData.getOwnComments('c'),
			{}
		)
		expectToEqual(
			userData.getOwnComments('c', 111),
			[]
		)
		expectToEqual(
			userData.getOwnComments('c', 111, 112),
			false
		)
		userData.removeOwnComments('b')
		expectToEqual(
			storage.data,
			{
				ownComments: {
					a: {
						'123': [
							124,
							125
						],
						'456': [
							456
						]
					}
				}
			}
		)
		userData.removeOwnComments('a', 456)
		expectToEqual(
			storage.data,
			{
				ownComments: {
					a: {
						'123': [
							124,
							125
						]
					}
				}
			}
		)
		userData.removeOwnComments('a', 123, 124)
		expectToEqual(
			storage.data,
			{
				ownComments: {
					a: {
						'123': [
							125
						]
					}
				}
			}
		)
		userData.removeOwnComments('a', 123)
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
						456
					],
					b: [
						789
					]
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