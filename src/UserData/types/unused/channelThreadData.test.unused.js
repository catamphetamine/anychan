import UserData from '../UserData'
import { MemoryStorage } from 'web-browser-storage'

describe('UserData', () => {
	it('should add/remove/get own comments', () => {
		const storage = new MemoryStorage()
		const userData = new UserData(storage)

		userData.setLatestReadCommentId('a', 123, 124)
		expectToEqual(
			userData.get(),
			{
				latestReadComments: {
					a: {
						'123': 124
					}
				}
			}
		)

		userData.setLatestReadCommentId('a', 123, 125)
		expectToEqual(
			storage.getData(),
			{
				latestReadComments: {
					a: {
						'123': 125
					}
				}
			}
		)

		userData.setLatestReadCommentId('a', 456, 456)
		expectToEqual(
			userData.get(),
			{
				latestReadComments: {
					a: {
						'123': 125,
						'456': 456
					}
				}
			}
		)

		userData.setLatestReadCommentId('b', 789, 790)
		expectToEqual(
			userData.get(),
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
			userData.getLatestReadCommentId('b', 789),
			790
		)
		expectToEqual(
			userData.getLatestReadCommentId('b', 790),
			undefined
		)

		userData.removeLatestReadCommentId('b')
		expectToEqual(
			userData.get(),
			{
				latestReadComments: {
					a: {
						'123': 125,
						'456': 456
					}
				}
			}
		)

		userData.removeLatestReadComment('a', 456)
		expectToEqual(
			userData.get(),
			{
				latestReadComments: {
					a: {
						'123': 125
					}
				}
			}
		)

		userData.removeLatestReadComment('a', 123)
		expectToEqual(
			userData.get(),
			{}
		)
	})

	it('should merge', () => {
		const storage = new MemoryStorage()
		const userData = new UserData(storage)

		userData.replace({
			version: 5,
			latestReadComments: {
				a: {
					'123': 124
				},
				c: {
					'888': 889
				}
			}
		}
		userData.merge({
			latestReadComments: {
				a: {
					'123': 125,
					'456': 457
				},
				b: {
					'789': 789
				},
				c: {
					'888': 888
				}
			}
		})

		expectToEqual(
			userData.get(),
			{
				latestReadComments: {
					a: {
						'123': 125,
						'456': 457
					},
					b: {
						'789': 789
					},
					c: {
						'888': 889
					}
				}
			}
		)
	})
})