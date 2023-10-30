import onThreadExpired from './onThreadExpired.js'
import addSubscribedThread from '../subscribedThread/addSubscribedThread.js'

import UserData from '../../UserData/UserData.js'
import { MemoryStorage } from 'web-browser-storage'
import { TestTimer } from 'web-browser-timer'

describe('onThreadExpired', () => {
	it('shouldn\'t clear thread data on expiry (but should mark subscribed thread as expired)', async () => {
		const storage = new MemoryStorage()
		const userData = new UserData(storage)

		const timer = new TestTimer()

		await timer.fastForward(1000)

		const now = new Date(timer.now())

		const channel1 = { id: 'a' }

		const thread1 = {
			id: 123,
			title: 'Anime 1',
			channelId: channel1.id,
			addedAt: now,
			comments: [{
				id: 123,
				content: 'Comment 1',
				createdAt: now
			}]
		}

		const channel2 = { id: 'a' }

		const thread2 = {
			id: 456,
			title: 'Anime 2',
			channelId: channel2.id,
			addedAt: now,
			comments: [{
				id: 456,
				content: 'Comment 1',
				createdAt: now
			}]
		}

		const channel3 = { id: 'b' }

		const thread3 = {
			id: 789,
			title: 'Random 1',
			channelId: channel3.id,
			addedAt: now,
			comments: [{
				id: 789,
				content: 'Comment 1',
				createdAt: now
			}]
		}

		const subscribedThreadsUpdater = {
			wasReset: false,
			reset() {
				this.wasReset = true
			}
		}

		userData.setLatestReadCommentId('a', 123, 124)
		userData.setLatestReadCommentId('a', 456, 456)
		userData.setLatestReadCommentId('a', 456, 457)
		userData.setLatestReadCommentId('b', 789, 790)

		addSubscribedThread(thread1, { channel: channel1, userData, timer, subscribedThreadsUpdater })
		addSubscribedThread(thread2, { channel: channel2, userData, timer, subscribedThreadsUpdater })
		addSubscribedThread(thread3, { channel: channel3, userData, timer, subscribedThreadsUpdater })

		userData.addHiddenComment('a', 123, 124)
		userData.addHiddenComment('a', 123, 125)
		userData.addHiddenComment('a', 456, 456)
		userData.addHiddenComment('a', 456, 457)
		userData.addHiddenComment('b', 789, 790)

		userData.setThreadVote('a', 456, 1)

		userData.setCommentVote('a', 123, 124, 1)
		userData.setCommentVote('a', 456, 457, 1)
		userData.setCommentVote('b', 789, 790, -1)

		expectToEqual(
			userData.get(),
			{
				subscribedThreadsIndex: {
					a: [
						123,
						456
					],
					b: [
						789
					]
				},
				subscribedThreads: [
					{
						id: 123,
						title: 'Anime 1',
						channel: {
							id: 'a'
						},
						addedAt: 1
					},
					{
						id: 456,
						title: 'Anime 2',
						channel: {
							id: 'a'
						},
						addedAt: 1
					},
					{
						id: 789,
						title: 'Random 1',
						channel: {
							id: 'b'
						},
						addedAt: 1
					}
				],
				subscribedThreadsState: {
					a: {
						'123': {
							commentsCount: 1,
							newCommentsCount: 0,
							newRepliesCount: 0,
							refreshedAt: 1,
							latestComment: {
								id: 123,
								createdAt: 1
							}
						},
						'456': {
							commentsCount: 1,
							newCommentsCount: 0,
							newRepliesCount: 0,
							refreshedAt: 1,
							latestComment: {
								id: 456,
								createdAt: 1
							}
						}
					},
					b: {
						'789': {
							commentsCount: 1,
							newCommentsCount: 0,
							newRepliesCount: 0,
							refreshedAt: 1,
							latestComment: {
								id: 789,
								createdAt: 1
							}
						}
					}
				},
				latestReadComments: {
					a: {
						'123': 124,
						'456': 457
					},
					b: {
						'789': 790,
					}
				},
				hiddenComments: {
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
				},
				threadVotes: {
					a: {
						'456': 1
					}
				},
				commentVotes: {
					a: {
						'123': {
							'124': 1
						},
						'456': {
							'457': 1
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

		const dispatchedActions = []
		const dispatch = (action) => {
			dispatchedActions.push(action)
		}

		// Expire unrelated thread `/c/777`.
		onThreadExpired('c', 777, { dispatch, userData })

		// Expire thread `/a/456`.
		onThreadExpired('a', 456, { dispatch, userData })

		expectToEqual(
			userData.get(),
			{
				subscribedThreadsIndex: {
					a: [
						123,
						456
					],
					b: [
						789
					]
				},
				// `subscribedThreads` list gets re-sorted according to their latest comment date.
				subscribedThreads: [
					{
						id: 123,
						title: 'Anime 1',
						channel: {
							id: 'a'
						},
						addedAt: 1
					},
					{
						id: 789,
						title: 'Random 1',
						channel: {
							id: 'b'
						},
						addedAt: 1
					},
					{
						id: 456,
						title: 'Anime 2',
						channel: {
							id: 'a'
						},
						expired: true,
						addedAt: 1
					}
				],
				subscribedThreadsState: {
					a: {
						'123': {
							commentsCount: 1,
							newCommentsCount: 0,
							newRepliesCount: 0,
							refreshedAt: 1,
							latestComment: {
								id: 123,
								createdAt: 1
							}
						},
						'456': {
							commentsCount: 1,
							newCommentsCount: 0,
							newRepliesCount: 0,
							refreshedAt: 1,
							latestComment: {
								id: 456,
								createdAt: 1
							}
						}
					},
					b: {
						'789': {
							commentsCount: 1,
							newCommentsCount: 0,
							newRepliesCount: 0,
							refreshedAt: 1,
							latestComment: {
								id: 789,
								createdAt: 1
							}
						}
					}
				},
				latestReadComments: {
					a: {
						'123': 124,
						'456': 457
					},
					b: {
						'789': 790,
					}
				},
				hiddenComments: {
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
				},
				threadVotes: {
					a: {
						'456': 1
					}
				},
				commentVotes: {
					a: {
						'123': {
							'124': 1
						},
						'456': {
							'457': 1
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
	})
})