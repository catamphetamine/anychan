import onSubscribedThreadFetchError from './onSubscribedThreadFetchError.js'
import addSubscribedThread from './addSubscribedThread.js'
import getDateWithoutMilliseconds from '../getDateWithoutMilliseconds.js'
import roundTimestamp from '../roundTimestamp.js'
import UserData from '../../UserData/UserData.js'

import { MemoryStorage } from 'web-browser-storage'
import { TestTimer } from 'web-browser-timer'

describe('onSubscribedThreadFetchError', () => {
	it('should set subscribed thread errored state', async () => {
		const storage = new MemoryStorage()
		const userData = new UserData(storage)

		const timer = new TestTimer()
		await timer.fastForward(Date.now())

		const now = getDateWithoutMilliseconds(new Date(timer.now()))

		const channel = {
			id: 'a',
			title: 'Anime'
		}

		const thread = {
			id: 100,
			channelId: 'a',
			title: 'Anime 1',
			comments: [{
				id: 100,
				createdAt: new Date(0)
			}]
		}

		const subscribedThreadsUpdater = {
			wasReset: false,
			reset() {
				this.wasReset = true
			}
		}

		addSubscribedThread(thread, { userData, timer, subscribedThreadsUpdater })

		// Errored first time.
		onSubscribedThreadFetchError({
			channelId: thread.channelId,
			threadId: thread.id
		}, {
			timer,
			userData
		})

		expectToEqual(
			userData.getSubscribedThreadState('a', 100),
			{
				refreshErrorAt: now,
				refreshErrorCount: 1,
				latestComment: {
					id: 100,
					createdAt: new Date(0)
				},
				commentsCount: 1,
				newCommentsCount: 1,
				newRepliesCount: 0,
				refreshedAt: now
			}
		)

		await timer.fastForward(1000)

		const now2 = getDateWithoutMilliseconds(new Date(timer.now()))

		// Errored second time.
		onSubscribedThreadFetchError({
			channelId: thread.channelId,
			threadId: thread.id
		}, {
			timer,
			userData
		})

		expectToEqual(
			userData.getSubscribedThreadState('a', 100),
			{
				refreshErrorAt: now2,
				refreshErrorCount: 2,
				latestComment: {
					id: 100,
					createdAt: new Date(0)
				},
				commentsCount: 1,
				newCommentsCount: 1,
				newRepliesCount: 0,
				refreshedAt: now
			}
		)
	})

	it('should set subscribed thread errored state when stats record not found', async () => {
		const storage = new MemoryStorage()
		const userData = new UserData(storage)

		const timer = new TestTimer()
		await timer.fastForward(Date.now())

		const now = getDateWithoutMilliseconds(new Date(timer.now()))

		const channel = {
			id: 'a',
			title: 'Anime'
		}

		const thread = {
			id: 100,
			channelId: 'a',
			title: 'Anime 1',
			comments: [{
				id: 100,
				createdAt: new Date(0)
			}]
		}

		const subscribedThreadsUpdater = {
			wasReset: false,
			reset() {
				this.wasReset = true
			}
		}

		addSubscribedThread(thread, { userData, timer, subscribedThreadsUpdater })

		userData.removeSubscribedThreadState('a', 100)

		// Errored first time.
		onSubscribedThreadFetchError({
			channelId: thread.channelId,
			threadId: thread.id
		}, {
			timer,
			userData
		})

		expectToEqual(
			userData.getSubscribedThreadState('a', 100),
			{
				refreshErrorAt: now,
				refreshErrorCount: 1,
				latestComment: {
					id: 100,
					createdAt: now
				},
				commentsCount: 1,
				newCommentsCount: 0,
				newRepliesCount: 0,
				refreshedAt: now
			}
		)
	})
})