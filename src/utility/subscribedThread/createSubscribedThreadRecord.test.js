import createSubscribedThreadRecord from './createSubscribedThreadRecord.js'
import UserData from '../../UserData/UserData.js'

import { MemoryStorage } from 'web-browser-storage'

const storage = new MemoryStorage()
const userData = new UserData(storage)

describe('createSubscribedThreadRecord', () => {
	it('should create subscribed thread record', () => {
		const subscribedThread = createSubscribedThreadRecord({
			id: 100,
			title: 'Anime 1',
			channelId: 'a',
			commentsCount: 3,
			comments: [{
				id: 100,
				indexForLatestReadCommentDetection: 0,
				createdAt: new Date(0),
				attachments: [{
					type: 'picture',
					spoiler: true,
					picture: {
						type: 'image/jpeg',
						width: 64,
						height: 64,
						url: 'https://example.com/1-original.jpg',
						sizes: [{
							type: 'image/jpeg',
							width: 32,
							height: 32,
							url: 'https://example.com/1.jpg'
						}]
					}
				}]
			}, {
				id: 101,
				indexForLatestReadCommentDetection: 1,
				createdAt: new Date(1000)
			}, {
				id: 102,
				indexForLatestReadCommentDetection: 2,
				createdAt: new Date(2000)
			}]
		}, {
			channel: {
				id: 'a',
				title: 'Anime'
			},
			userData
		})

		expectToEqual(
			subscribedThread,
			{
				id: 100,
				title: 'Anime 1',
				channel: {
					id: 'a',
					title: 'Anime'
				},
				thumbnail: {
					type: 'image/jpeg',
					width: 32,
					height: 32,
					url: 'https://example.com/1.jpg',
					spoiler: true
				}
			}
		)

		// A subscribed thread record returned from `createSubscribedThreadRecord()`
		// shouldn't have an `addedAt` date because `createSubscribedThreadRecord()`
		// is also used in `onSubscribedThreadFetched()`.
		expectToEqual(subscribedThread.addedAt, undefined)
	})

	it('should create subscribed thread record (locked thread)', () => {
		const subscribedThread = createSubscribedThreadRecord({
			id: 100,
			title: 'Anime 1',
			channelId: 'a',
			locked: true,
			commentsCount: 3,
			comments: [{
				id: 100,
				indexForLatestReadCommentDetection: 0,
				createdAt: new Date(0)
			}, {
				id: 101,
				indexForLatestReadCommentDetection: 1,
				createdAt: new Date(1000)
			}, {
				id: 102,
				indexForLatestReadCommentDetection: 2,
				createdAt: new Date(2000)
			}]
		}, {
			channel: {
				id: 'a',
				title: 'Anime'
			},
			userData
		})

		expectToEqual(
			subscribedThread,
			{
				id: 100,
				title: 'Anime 1',
				channel: {
					id: 'a',
					title: 'Anime'
				},
				locked: true,
				// lockedAt: new Date(4000)
			}
		)
	})

	it('should create subscribed thread record ("trimming" thread)', () => {
		const subscribedThread = createSubscribedThreadRecord({
			id: 100,
			title: 'Anime 1',
			channelId: 'a',
			trimming: true,
			commentsCount: 3,
			comments: [{
				id: 100,
				indexForLatestReadCommentDetection: 0,
				createdAt: new Date(0)
			}, {
				id: 101,
				indexForLatestReadCommentDetection: 1,
				createdAt: new Date(1000)
			}, {
				id: 102,
				indexForLatestReadCommentDetection: 2,
				createdAt: new Date(2000)
			}]
		}, {
			channel: {
				id: 'a',
				title: 'Anime'
			},
			userData
		})

		expectToEqual(
			subscribedThread,
			{
				id: 100,
				title: 'Anime 1',
				channel: {
					id: 'a',
					title: 'Anime'
				},
				trimming: true
			}
		)
	})

	it('should set latest comments', () => {
		const subscribedThread = createSubscribedThreadRecord({
			id: 100,
			title: 'Anime 1',
			channelId: 'a',
			trimming: true,
			commentsCount: 3,
			comments: [{
				id: 100,
				indexForLatestReadCommentDetection: 0,
				createdAt: new Date(0)
			}, {
				id: 101,
				indexForLatestReadCommentDetection: 1,
				createdAt: new Date(1000)
			}, {
				id: 102,
				indexForLatestReadCommentDetection: 2,
				createdAt: new Date(2000)
			}]
		}, {
			channel: {
				id: 'a',
				title: 'Anime'
			},
			userData
		})

		userData.setLatestReadCommentId('a', 100, 101)

		expectToEqual(
			subscribedThread,
			{
				id: 100,
				title: 'Anime 1',
				channel: {
					id: 'a',
					title: 'Anime'
				},
				trimming: true
			}
		)
	})

	it('should set latest replies', () => {
		const COMMENT_1 = {
			id: 100,
			indexForLatestReadCommentDetection: 0,
			createdAt: new Date(0)
		}

		const COMMENT_2 = {
			id: 101,
			indexForLatestReadCommentDetection: 1,
			createdAt: new Date(1000),
			inReplyTo: [COMMENT_1]
		}

		const COMMENT_3 = {
			id: 102,
			indexForLatestReadCommentDetection: 2,
			createdAt: new Date(2000),
			inReplyTo: [COMMENT_2]
		}

		const subscribedThread = createSubscribedThreadRecord({
			id: 100,
			title: 'Anime 1',
			channelId: 'a',
			commentsCount: 3,
			comments: [COMMENT_1, COMMENT_2, COMMENT_3]
		}, {
			channel: {
				id: 'a',
				title: 'Anime'
			},
			userData
		})

		userData.addOwnComment('a', 100, COMMENT_1.id)
		userData.setLatestReadCommentId('a', 100, COMMENT_1.id)

		expectToEqual(
			subscribedThread,
			{
				id: 100,
				title: 'Anime 1',
				channel: {
					id: 'a',
					title: 'Anime'
				}
			}
		)
	})
})
