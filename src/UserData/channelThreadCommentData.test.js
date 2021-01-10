import { describe, it } from 'webapp-frontend/src/utility/mocha'
import expectToEqual from 'webapp-frontend/src/utility/expectToEqual'

import { UserData } from './UserData'
import MemoryStorage from 'webapp-frontend/src/utility/storage/MemoryStorage'

const storage = new MemoryStorage({
	emulateSerialize: true
})
const userData = new UserData(storage, {
	prefix: ''
})

describe('UserData', () => {
	it('should add/remove/get comment votes', () => {
		storage.clear()
		userData.setCommentVote('a', 123, 124, 1)
		expectToEqual(
			storage.data,
			{
				commentVotes: {
					a: {
						'123': {
							'124': 1
						}
					}
				}
			}
		)
		userData.setCommentVote('a', 123, 125, -1)
		expectToEqual(
			storage.data,
			{
				commentVotes: {
					a: {
						'123': {
							'124': 1,
							'125': -1
						}
					}
				}
			}
		)
		userData.setCommentVote('a', 456, 456, 1)
		expectToEqual(
			storage.data,
			{
				commentVotes: {
					a: {
						'123': {
							'124': 1,
							'125': -1
						},
						'456': {
							'456': 1
						}
					}
				}
			}
		)
		userData.setCommentVote('b', 789, 790, -1)
		expectToEqual(
			storage.data,
			{
				commentVotes: {
					a: {
						'123': {
							'124': 1,
							'125': -1
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
		expectToEqual(
			userData.getCommentVote(),
			{
				a: {
					'123': {
						'124': 1,
						'125': -1
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
		)
		expectToEqual(
			userData.getCommentVote('b', 789, 790),
			-1
		)
		expectToEqual(
			userData.getCommentVote('b', 789, 791),
			undefined
		)
		expectToEqual(
			userData.getCommentVote('b', 789),
			{
				'790': -1
			}
		)
		expectToEqual(
			userData.getCommentVote('a'),
			{
				'123': {
					'124': 1,
					'125': -1
				},
				'456': {
					'456': 1
				}
			}
		)
		expectToEqual(
			userData.getCommentVote('c'),
			{}
		)
		expectToEqual(
			userData.getCommentVote('c', 111),
			{}
		)
		expectToEqual(
			userData.getCommentVote('c', 111, 112),
			undefined
		)
		userData.removeCommentVote('b')
		expectToEqual(
			storage.data,
			{
				commentVotes: {
					a: {
						'123': {
							'124': 1,
							'125': -1
						},
						'456': {
							'456': 1
						}
					}
				}
			}
		)
		userData.removeCommentVote('a', 456)
		expectToEqual(
			storage.data,
			{
				commentVotes: {
					a: {
						'123': {
							'124': 1,
							'125': -1
						}
					}
				}
			}
		)
		userData.removeCommentVote('a', 123)
		expectToEqual(
			storage.data,
			{}
		)
	})

	it('should merge comment votes', () => {
		storage.data = {
			commentVotes: {
				a: {
					'123': {
						'123': 1,
						'124': -1
					},
					'125': {
						'126': 1
					}
				}
			}
		}
		userData.merge({
			commentVotes: {
				a: {
					'123': {
						'123': -1,
						'124': 1
					},
					'125': {
						'127': 1
					},
					'456': {
						'456': -1
					}
				},
				b: {
					'789': {
						'790': 1
					}
				}
			}
		})
		expectToEqual(
			storage.data,
			{
				commentVotes: {
					a: {
						'123': {
							'123': -1,
							'124': 1
						},
						'125': {
							'126': 1,
							'127': 1
						},
						'456': {
							'456': -1
						}
					},
					b: {
						'789': {
							'790': 1
						}
					}
				}
			}
		)
	})

	it('should merge comment votes (source not exists)', () => {
		storage.data = {}
		userData.merge({
			commentVotes: {
				a: {
					'123': {
						'123': 1
					}
				}
			}
		})
		expectToEqual(
			storage.data,
			{
				commentVotes: {
					a: {
						'123': {
							'123': 1
						}
					}
				}
			}
		)
	})

	it('should merge comment votes (destination not exists)', () => {
		storage.data = {
			commentVotes: {
				a: {
					'123': {
						'123': 1
					}
				}
			}
		}
		userData.merge({})
		expectToEqual(
			storage.data,
			{
				commentVotes: {
					a: {
						'123': {
							'123': 1
						}
					}
				}
			}
		)
	})
})