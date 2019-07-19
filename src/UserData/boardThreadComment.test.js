import { describe, it } from 'webapp-frontend/src/utility/mocha'
import expectToEqual from 'webapp-frontend/src/utility/expectToEqual'

import { UserData } from './UserData'
import MemoryStorage from 'webapp-frontend/src/utility/MemoryStorage'

const storage = new MemoryStorage()
const userData = new UserData(storage)
userData.prefix = ''

describe('UserData', () => {
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
})