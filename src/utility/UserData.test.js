import { describe, it } from 'webapp-frontend/src/utility/mocha'
import expectToEqual from 'webapp-frontend/src/utility/expectToEqual'

import { UserData } from './UserData'
import MemoryStorage from './MemoryStorage'

const storage = new MemoryStorage()
const userData = new UserData(storage)
userData.prefix = ''

describe('UserData', () => {
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

	it('should merge favorite boards (intersection)', () => {
		storage.clear()
		storage.data = {
			favoriteBoards: [
				'a',
				'b'
			]
		}
		userData.merge({
			favoriteBoards: [
				'b',
				'c'
			]
		})
		expectToEqual(
			storage.data,
			{
				favoriteBoards: [
					'a',
					'b',
					'c'
				]
			}
		)
	})

	it('should merge favorite boards (destination not exists)', () => {
		storage.data = {}
		userData.merge({
			favoriteBoards: [
				'b',
				'c'
			]
		})
		expectToEqual(
			storage.data,
			{
				favoriteBoards: [
					'b',
					'c'
				]
			}
		)
	})

	it('should merge favorite boards (source not exists)', () => {
		storage.clear()
		storage.data = {
			favoriteBoards: [
				'b',
				'c'
			]
		}
		userData.merge({})
		expectToEqual(
			storage.data,
			{
				favoriteBoards: [
					'b',
					'c'
				]
			}
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

	it('should merge watched threads (intersection)', () => {
		storage.data = {
			watchedThreads: {
				a: [
					123
				],
				b: [
					789
				]
			}
		}
		userData.merge({
			watchedThreads: {
				a: [
					123,
					456
				],
				b: [
					790
				],
				c: [
					111,
					222
				]
			}
		})
		expectToEqual(
			storage.data,
			{
				watchedThreads: {
					a: [
						123,
						456
					],
					b: [
						789,
						790
					],
					c: [
						111,
						222
					]
				}
			}
		)
	})

	it('should merge watched threads (no source)', () => {
		storage.data = {
			watchedThreads: {
				a: [123]
			}
		}
		userData.merge({})
		expectToEqual(
			storage.data,
			{
				watchedThreads: {
					a: [123]
				}
			}
		)
	})

	it('should merge watched threads (no destination)', () => {
		storage.data = {}
		userData.merge({
			watchedThreads: {
				a: [123]
			}
		})
		expectToEqual(
			storage.data,
			{
				watchedThreads: {
					a: [123]
				}
			}
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

	it('should merge read comments', () => {
		storage.data = {
			readComments: {
				a: {
					'123': 124,
					'125': 126
				}
			}
		}
		userData.merge({
			readComments: {
				a: {
					'123': 123,
					'125': 127,
					'456': 456
				},
				b: {
					'789': 790
				}
			}
		})
		expectToEqual(
			storage.data,
			{
				readComments: {
					a: {
						'123': 124,
						'125': 127,
						'456': 456
					},
					b: {
						'789': 790
					}
				}
			}
		)
	})

	it('should merge read comments (source not exists)', () => {
		storage.data = {}
		userData.merge({
			readComments: {
				a: {
					'123': 123
				}
			}
		})
		expectToEqual(
			storage.data,
			{
				readComments: {
					a: {
						'123': 123
					}
				}
			}
		)
	})

	it('should merge read comments (destination not exists)', () => {
		storage.data = {
			readComments: {
				a: {
					'123': 123
				}
			}
		}
		userData.merge({})
		expectToEqual(
			storage.data,
			{
				readComments: {
					a: {
						'123': 123
					}
				}
			}
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

	it('should merge own comments', () => {
		storage.data = {
			ownComments: {
				a: {
					'123': [
						124
					]
				}
			}
		}
		userData.merge({
			ownComments: {
				a: {
					'123': [
						123,
						125
					],
					'456': [
						457
					]
				},
				b: {
					'789': [
						789
					]
				}
			}
		})
		expectToEqual(
			storage.data,
			{
				ownComments: {
					a: {
						'123': [
							124,
							123,
							125
						],
						'456': [
							457
						]
					},
					b: {
						'789': [
							789
						]
					}
				}
			}
		)
	})

	it('should merge own comments (source not exists)', () => {
		storage.data = {}
		userData.merge({
			ownComments: {
				a: {
					'123': [
						124
					]
				}
			}
		})
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
	})

	it('should merge own comments (destination not exists)', () => {
		storage.data = {
			ownComments: {
				a: {
					'123': [
						124
					]
				}
			}
		}
		userData.merge({})
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
	})

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