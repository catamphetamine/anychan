import UserData from '../UserData'
import { MemoryStorage } from 'web-browser-storage'

function create() {
	const storage = new MemoryStorage()
	const userData = new UserData(storage)
	return { storage, userData }
}

describe('UserData', () => {
	it('should add/remove/get hidden comments', () => {
		const { storage, userData } = create()
		userData.addHiddenComments('a', 123, 124)
		expectToEqual(
			storage.getData(),
			{
				hiddenComments: {
					a: {
						'123': [124]
					}
				}
			}
		)
		userData.addHiddenComments('a', 123, 125)
		expectToEqual(
			storage.getData(),
			{
				hiddenComments: {
					a: {
						'123': [124, 125]
					}
				}
			}
		)
		userData.addHiddenComments('a', 456, 456)
		expectToEqual(
			storage.getData(),
			{
				hiddenComments: {
					a: {
						'123': [124, 125],
						'456': [456]
					}
				}
			}
		)
		userData.addHiddenComments('b', 789, 790)
		expectToEqual(
			storage.getData(),
			{
				hiddenComments: {
					a: {
						'123': [124, 125],
						'456': [456]
					},
					b: {
						'789': [790]
					}
				}
			}
		)
		expectToEqual(
			userData.getHiddenComments(),
			{
				a: {
					'123': [124, 125],
					'456': [456]
				},
				b: {
					'789': [790]
				}
			}
		)
		expectToEqual(
			userData.getHiddenComments('b', 789, 790),
			true
		)
		expectToEqual(
			userData.getHiddenComments('b', 789, 791),
			false
		)
		expectToEqual(
			userData.getHiddenComments('b', 789),
			[790]
		)
		expectToEqual(
			userData.getHiddenComments('a'),
			{
				'123': [124, 125],
				'456': [456]
			}
		)
		expectToEqual(
			userData.getHiddenComments('c'),
			{}
		)
		expectToEqual(
			userData.getHiddenComments('c', 111),
			[]
		)
		expectToEqual(
			userData.getHiddenComments('c', 111, 112),
			false
		)
		userData.removeHiddenComments('b')
		expectToEqual(
			storage.getData(),
			{
				hiddenComments: {
					a: {
						'123': [124, 125],
						'456': [456]
					}
				}
			}
		)
		userData.removeHiddenComments('a', 456)
		expectToEqual(
			storage.getData(),
			{
				hiddenComments: {
					a: {
						'123': [124, 125]
					}
				}
			}
		)
		userData.removeHiddenComments('a', 123)
		expectToEqual(
			storage.getData(),
			{}
		)
	})

	it('should merge hidden comments', () => {
		storage.setData( {
			hiddenComments: {
				a: {
					'123': [124],
					'125': [126]
				}
			}
		}
		userData.merge({
			hiddenComments: {
				a: {
					'123': [123],
					'125': [127],
					'456': [456]
				},
				b: {
					'789': [790]
				}
			}
		})
		expectToEqual(
			storage.getData(),
			{
				hiddenComments: {
					a: {
						'123': [123, 124],
						'125': [126, 127],
						'456': [456]
					},
					b: {
						'789': [790]
					}
				}
			}
		)
	})

	it('should merge hidden comments (source not exists)', () => {
		storage.setData( {}
		userData.merge({
			hiddenComments: {
				a: {
					'123': [123]
				}
			}
		})
		expectToEqual(
			storage.getData(),
			{
				hiddenComments: {
					a: {
						'123': [123]
					}
				}
			}
		)
	})

	it('should merge hidden comments (destination not exists)', () => {
		storage.setData( {
			hiddenComments: {
				a: {
					'123': [123]
				}
			}
		}
		userData.merge({})
		expectToEqual(
			storage.getData(),
			{
				hiddenComments: {
					a: {
						'123': [123]
					}
				}
			}
		)
	})
})