import { MemoryStorage } from 'web-browser-storage'
import UserData from './UserData.js'

import { encodeDate } from './compression.js'

import fixSubscribedThreadsData from './fixSubscribedThreadsData.js'

describe('fixSubscribedThreadsData', function() {
	it('should fix subscribed thread data', function() {
		const storage = new MemoryStorage()
		const userData = new UserData(storage)

		const date = new Date()

		userData.replace({
			version: 5,
			subscribedThreads: [
				{
					id: 123,
					channel: {
						id: 'a',
						title: 'Anime'
					},
					title: 'Thread 1',
					addedAt: encodeDate(date)
				},
				{
					id: 777,
					channel: {
						id: 'c',
						title: 'Common'
					},
					title: 'Common Thread',
					addedAt: encodeDate(date)
				}
			],

			subscribedThreadsIndex: {
				'a': [123, 456],
				'b': [789]
			},

			subscribedThreadsState: {
				'a': {
					'123': {
						commentsCount: 1,
						newCommentsCount: 1,
						newRepliesCount: 2,
						latestComment: {
							id: 123,
							createdAt: encodeDate(date)
						},
						refreshedAt: encodeDate(date)
					},
					'456': {
						commentsCount: 1,
						newCommentsCount: 1,
						newRepliesCount: 2,
						latestComment: {
							id: 456,
							createdAt: encodeDate(date)
						},
						refreshedAt: encodeDate(date)
					}
				},
				'b': {
					'789': {
						commentsCount: 1,
						newCommentsCount: 1,
						newRepliesCount: 2,
						latestComment: {
							id: 789,
							createdAt: encodeDate(date)
						},
						refreshedAt: encodeDate(date)
					}
				}
			}
		})

		const fix = fixSubscribedThreadsData({ userData })
		fix()

		expectToEqual(
			userData.get(),
			{
				subscribedThreads: [
					{
						id: 123,
						channel: {
							id: 'a',
							title: 'Anime'
						},
						title: 'Thread 1',
						addedAt: encodeDate(date)
					},
					{
						id: 777,
						channel: {
							id: 'c',
							title: 'Common'
						},
						title: 'Common Thread',
						addedAt: encodeDate(date)
					}
				],

				subscribedThreadsIndex: {
					'a': [123],
					'c': [777]
				},

				subscribedThreadsState: {
					'a': {
						'123': {
							commentsCount: 1,
							newCommentsCount: 1,
							newRepliesCount: 2,
							latestComment: {
								id: 123,
								createdAt: encodeDate(date)
							},
							refreshedAt: encodeDate(date)
						}
					},
					'c': {
						'777': {
							commentsCount: 1,
							newCommentsCount: 0,
							newRepliesCount: 0,
							latestComment: {
								id: 777,
								createdAt: encodeDate(date)
							},
							refreshedAt: encodeDate(date)
						}
					}
				}
			}
		)
	})
})