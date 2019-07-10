import { describe, it } from 'webapp-frontend/src/utility/mocha'
import expectToEqual from 'webapp-frontend/src/utility/expectToEqual'

import { UserData } from './UserData'
import MemoryStorage from '../utility/MemoryStorage'

const storage = new MemoryStorage()
const userData = new UserData(storage)
userData.prefix = ''

describe('UserData', () => {
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
})