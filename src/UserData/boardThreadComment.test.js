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
	it('should add/remove/get read comments', () => {
		storage.clear()
		userData.addLatestReadComments('a', 123, 124)
		expectToEqual(
			storage.data,
			{
				latestReadComments: {
					a: {
						'123': 124
					}
				}
			}
		)
		userData.addLatestReadComments('a', 123, 125)
		expectToEqual(
			storage.data,
			{
				latestReadComments: {
					a: {
						'123': 125
					}
				}
			}
		)
		userData.addLatestReadComments('a', 456, 456)
		expectToEqual(
			storage.data,
			{
				latestReadComments: {
					a: {
						'123': 125,
						'456': 456
					}
				}
			}
		)
		userData.addLatestReadComments('b', 789, 790)
		expectToEqual(
			storage.data,
			{
				latestReadComments: {
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
			userData.getLatestReadComments(),
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
			userData.getLatestReadComments('b', 789, 790),
			true
		)
		expectToEqual(
			userData.getLatestReadComments('b', 789, 791),
			false
		)
		expectToEqual(
			userData.getLatestReadComments('b', 789),
			790
		)
		expectToEqual(
			userData.getLatestReadComments('a'),
			{
				'123': 125,
				'456': 456
			}
		)
		expectToEqual(
			userData.getLatestReadComments('c'),
			{}
		)
		expectToEqual(
			userData.getLatestReadComments('c', 111),
			undefined
		)
		expectToEqual(
			userData.getLatestReadComments('c', 111, 112),
			false
		)
		userData.removeLatestReadComments('b')
		expectToEqual(
			storage.data,
			{
				latestReadComments: {
					a: {
						'123': 125,
						'456': 456
					}
				}
			}
		)
		userData.removeLatestReadComments('a', 456)
		expectToEqual(
			storage.data,
			{
				latestReadComments: {
					a: {
						'123': 125
					}
				}
			}
		)
		userData.removeLatestReadComments('a', 123)
		expectToEqual(
			storage.data,
			{}
		)
	})

	it('should merge read comments', () => {
		storage.data = {
			latestReadComments: {
				a: {
					'123': 124,
					'125': 126
				}
			}
		}
		userData.merge({
			latestReadComments: {
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
				latestReadComments: {
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
			latestReadComments: {
				a: {
					'123': 123
				}
			}
		})
		expectToEqual(
			storage.data,
			{
				latestReadComments: {
					a: {
						'123': 123
					}
				}
			}
		)
	})

	it('should merge read comments (destination not exists)', () => {
		storage.data = {
			latestReadComments: {
				a: {
					'123': 123
				}
			}
		}
		userData.merge({})
		expectToEqual(
			storage.data,
			{
				latestReadComments: {
					a: {
						'123': 123
					}
				}
			}
		)
	})
})