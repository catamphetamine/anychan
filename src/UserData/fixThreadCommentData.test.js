import { MemoryStorage } from 'web-browser-storage'
import UserData from './UserData.js'

import fixThreadCommentData from './fixThreadCommentData.js'

describe('fixThreadCommentData', function() {
	it('should fix thread comment data', function() {
		const storage = new MemoryStorage()
		const userData = new UserData(storage)

		// Add "own" comments data.

		userData.addOwnComment('a', 100, 100)
		userData.addOwnComment('a', 100, 101)

		userData.addOwnComment('a', 200, 201)

		userData.addOwnComment('a', 300, 300)
		userData.addOwnComment('a', 300, 301)

		userData.addOwnComment('a', 400, 401)

		userData.addOwnComment('a', 500, 500)

		userData.addOwnThread('a', 300)
		userData.addOwnThread('a', 400)
		userData.addOwnThread('a', 500)
		userData.addOwnThread('a', 600)

		// Add "hidden" comments data.

		userData.addHiddenComment('a', 100, 100)
		userData.addHiddenComment('a', 100, 101)

		userData.addHiddenComment('a', 200, 201)

		userData.addHiddenComment('a', 300, 300)
		userData.addHiddenComment('a', 300, 301)

		userData.addHiddenComment('a', 400, 401)

		userData.addHiddenComment('a', 500, 500)

		userData.addHiddenThread('a', 300)
		userData.addHiddenThread('a', 400)
		userData.addHiddenThread('a', 500)
		userData.addHiddenThread('a', 600)

		// Add comment votes data.

		userData.setCommentVote('a', 100, 100, 1)
		userData.setCommentVote('a', 100, 101, 1)

		userData.setCommentVote('a', 200, 201, 1)

		userData.setCommentVote('a', 300, 300, 1)
		userData.setCommentVote('a', 300, 301, 1)

		userData.setCommentVote('a', 400, 401, 1)

		userData.setCommentVote('a', 500, 500, -1)

		userData.setThreadVote('a', 300, 1)
		userData.setThreadVote('a', 400, 1)
		userData.setThreadVote('a', 500, -1)
		userData.setThreadVote('a', 600, 1)

		// Fix the data.
		const fix = fixThreadCommentData({ userData })
		fix()

		// Check the fixed data.
		expectToEqual(
			userData.get(),
			{
				hiddenThreads: {
					'a': [
						100,
						300,
						400,
						500,
						600
					]
				},
				hiddenComments: {
					'a': {
						'100': [100, 101],
						'200': [201],
						'300': [300, 301],
						'400': [400, 401],
						'500': [500],
						'600': [600]
					}
				},
				ownThreads: {
					'a': [
						100,
						300,
						400,
						500,
						600
					]
				},
				ownComments: {
					'a': {
						'100': [100, 101],
						'200': [201],
						'300': [300, 301],
						'400': [400, 401],
						'500': [500],
						'600': [600]
					}
				},
				threadVotes: {
					'a': {
						'100': 1,
						'300': 1,
						'400': 1,
						'500': -1,
						'600': 1
					}
				},
				commentVotes: {
					'a': {
						'100': {
							'100': 1,
							'101': 1
						},
						'200': {
							'201': 1
						},
						'300': {
							'300': 1,
							'301': 1
						},
						'400': {
							'400': 1,
							'401': 1
						},
						'500': {
							'500': -1
						},
						'600': {
							'600': 1
						}
					}
				}
			}
		)
	})
})