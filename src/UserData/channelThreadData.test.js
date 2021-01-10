import { describe, it } from 'webapp-frontend/src/utility/mocha'
import expectToEqual from 'webapp-frontend/src/utility/expectToEqual'

import { UserData } from './UserData'
import MemoryStorage from 'webapp-frontend/src/utility/storage/MemoryStorage'

const storage = new MemoryStorage({
	emulateSerialize: true
})
const userData = new UserData(storage, {
	prefix: '',
	migrate: false
})

describe('UserData', () => {
	it('should add/remove/get own comments', () => {
		storage.clear()
		userData.setLatestReadComment('a', 123, { id: 124 })
		expectToEqual(
			storage.data,
			{
				latestReadComments: {
					a: {
						'123': {
							id: 124
						}
					}
				}
			}
		)
		userData.setLatestReadComment('a', 123, { id: 125 })
		expectToEqual(
			storage.data,
			{
				latestReadComments: {
					a: {
						'123': {
							id: 125
						}
					}
				}
			}
		)
		userData.setLatestReadComment('a', 456, { id: 456 })
		expectToEqual(
			storage.data,
			{
				latestReadComments: {
					a: {
						'123': {
							id: 125
						},
						'456': {
							id: 456
						}
					}
				}
			}
		)
		userData.setLatestReadComment('b', 789, { id: 790 })
		expectToEqual(
			storage.data,
			{
				latestReadComments: {
					a: {
						'123': {
							id: 125
						},
						'456': {
							id: 456
						}
					},
					b: {
						'789': {
							id: 790
						}
					}
				}
			}
		)
		expectToEqual(
			userData.getLatestReadComment('b', 789),
			{ id: 790 }
		)
		expectToEqual(
			userData.getLatestReadComment('b', 790),
			undefined
		)
		userData.removeLatestReadComment('b')
		expectToEqual(
			storage.data,
			{
				latestReadComments: {
					a: {
						'123': {
							id: 125
						},
						'456': {
							id: 456
						}
					}
				}
			}
		)
		userData.removeLatestReadComment('a', 456)
		expectToEqual(
			storage.data,
			{
				latestReadComments: {
					a: {
						'123': {
							id: 125
						}
					}
				}
			}
		)
		userData.removeLatestReadComment('a', 123)
		expectToEqual(
			storage.data,
			{}
		)
	})

	it('should merge', () => {
		storage.data = {
			latestReadComments: {
				a: {
					'123': {
						id: 124
					}
				},
				c: {
					'888': {
						id: 889
					}
				}
			}
		}
		userData.merge({
			latestReadComments: {
				a: {
					'123': {
						id: 125
					},
					'456': {
						id: 457
					}
				},
				b: {
					'789': {
						id: 789
					}
				},
				c: {
					'888': {
						id: 888
					}
				}
			}
		})
		expectToEqual(
			storage.data,
			{
				latestReadComments: {
					a: {
						'123': {
							id: 125
						},
						'456': {
							id: 457
						}
					},
					b: {
						'789': {
							id: 789
						}
					},
					c: {
						'888': {
							id: 889
						}
					}
				}
			}
		)
	})
})