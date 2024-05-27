import sortSubscribedThreads from './sortSubscribedThreads.js'
import addSubscribedThread from './addSubscribedThread.js'
import UserData from '../../UserData/UserData.js'

import { MemoryStorage } from 'web-browser-storage'
import { TestTimer } from 'web-browser-timer'

describe('sortSubscribedThreads', () => {
	it('should sort subscribed threads', async () => {
		const storage = new MemoryStorage()
		const userData = new UserData(storage)

		const dispatchedActions = []

		const dispatch = (action) => {
			dispatchedActions.push(action)
		}

		const timer = new TestTimer({
			log: (...args) => console.log('timer:', ...args)
		})

		await timer.fastForward(1500)

		const channel = {
			id: 'a',
			title: 'Anime'
		}

		const EXPIRED = {
			id: 101,
			title: 'Anime 1',
			expired: true,
			channelId: channel.id,
			comments: [{
				id: 101,
				createdAt: new Date(1000)
			}, {
				id: 102,
				createdAt: new Date(2000)
			}, {
				id: 103,
				createdAt: new Date(3000)
			}]
		}

		const ADDED_AT_1500__0_UNREAD_COMMENTS = {
			id: 201,
			title: 'Anime 2',
			channelId: channel.id,
			comments: [{
				id: 201,
				createdAt: new Date(1000)
			}, {
				id: 202,
				createdAt: new Date(2000)
			}, {
				id: 203,
				createdAt: new Date(3000)
			}]
		}

		userData.setLatestReadCommentId('a', 201, 203)

		const ADDED_AT_1500__2_UNREAD_COMMENTS = {
			id: 301,
			title: 'Anime 3',
			channelId: channel.id,
			comments: [{
				id: 301,
				createdAt: new Date(1000)
			}, {
				id: 302,
				createdAt: new Date(2000)
			}, {
				id: 303,
				createdAt: new Date(3000)
			}]
		}

		userData.setLatestReadCommentId('a', 301, 301)

		const OWN_THREAD__ADDED_AT_1500__2_UNREAD_COMMENTS = {
			id: 401,
			title: 'Anime 4',
			channelId: channel.id,
			comments: [{
				id: 401,
				createdAt: new Date(1000)
			}, {
				id: 402,
				createdAt: new Date(2000)
			}, {
				id: 403,
				createdAt: new Date(3000)
			}]
		}

		userData.setLatestReadCommentId('a', 401, 401)

		userData.addOwnThread('a', 401)
		userData.addOwnComment('a', 401, 401)

		const ADDED_AT_1500__1_UNREAD_REPLY = {
			id: 401,
			title: 'Anime 4',
			channelId: channel.id,
			comments: [{
				id: 401,
				createdAt: new Date(1000)
			}, {
				id: 402,
				createdAt: new Date(2000)
			}, {
				id: 403,
				createdAt: new Date(3000)
			}]
		}

		ADDED_AT_1500__1_UNREAD_REPLY.comments[2].inReplyTo = [ADDED_AT_1500__1_UNREAD_REPLY.comments[0]]

		userData.setLatestReadCommentId('a', 401, 402)

		userData.addOwnThread('a', 401)
		userData.addOwnComment('a', 401, 401)

		const subscribedThreads = [
			EXPIRED,
			ADDED_AT_1500__0_UNREAD_COMMENTS,
			ADDED_AT_1500__2_UNREAD_COMMENTS,
			ADDED_AT_1500__1_UNREAD_REPLY,
			OWN_THREAD__ADDED_AT_1500__2_UNREAD_COMMENTS
		].map(
			(thread) => {
				const subscribedThreadsUpdater = {
					wasReset: false,
					reset() {
						this.wasReset = true
					}
				}
				addSubscribedThread({
					thread,
					dispatch,
					userData,
					timer,
					subscribedThreadsUpdater
				})
				return userData.getSubscribedThread(thread.channelId, thread.id)
			}
		)

		sortSubscribedThreads(subscribedThreads, { userData })

		expectToEqual(
			subscribedThreads,
			[
				ADDED_AT_1500__1_UNREAD_REPLY,
				OWN_THREAD__ADDED_AT_1500__2_UNREAD_COMMENTS,
				ADDED_AT_1500__2_UNREAD_COMMENTS,
				ADDED_AT_1500__0_UNREAD_COMMENTS,
			  EXPIRED
			].map(
				(thread) => userData.getSubscribedThread(thread.channelId, thread.id)
			)
		)
	})
})