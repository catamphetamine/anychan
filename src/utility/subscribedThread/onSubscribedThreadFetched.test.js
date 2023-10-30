import onSubscribedThreadFetched from './onSubscribedThreadFetched.js'
import addSubscribedThread from './addSubscribedThread.js'
import getDateWithoutMilliseconds from '../getDateWithoutMilliseconds.js'
import roundTimestamp from '../roundTimestamp.js'
import UserData from '../../UserData/UserData.js'

import { MemoryStorage } from 'web-browser-storage'
import { TestTimer } from 'web-browser-timer'

describe('onSubscribedThreadFetched', () => {
	it('should update subscribed thread comments count and latest comment info', async () => {
		const storage = new MemoryStorage()
		const userData = new UserData(storage)

		const timer = new TestTimer()
		await timer.fastForward(Date.now())

		const now = getDateWithoutMilliseconds(new Date(timer.now()))
		const nowRoundDays = new Date(roundTimestamp(now.getTime(), { granularity: 'days' }))

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

		addSubscribedThread(thread, { channel, userData, timer, subscribedThreadsUpdater })

		thread.comments.push({
			id: 101,
			createdAt: new Date(1000)
		})

		thread.comments.push({
			id: 102,
			createdAt: new Date(2000)
		})

		thread.trimming = true

		let changed = onSubscribedThreadFetched(thread, {
			timer,
			userData
		})

		// New data has been received. Returns `true`.
		expectToEqual(changed, true)

		expectToEqual(
			userData.getSubscribedThread('a', 100),
			{
				id: 100,
				channel,
				title: 'Anime 1',
				trimming: true,
				addedAt: now,
				updatedAt: now
			}
		)

		expectToEqual(
			userData.getSubscribedThreadState('a', 100),
			{
				latestComment: {
					id: 102,
					createdAt: new Date(2000)
				},
				commentsCount: 3,
				newCommentsCount: 3,
				newRepliesCount: 0,
				refreshedAt: now
			}
		)

		changed = onSubscribedThreadFetched(thread, {
			timer,
			userData
		})

		// No new data has been received. Returns `false`.
		expectToEqual(changed, false)
	})

	it('should update subscribed thread locked status (catalog API response)', async () => {
		const storage = new MemoryStorage()
		const userData = new UserData(storage)

		const timer = new TestTimer()
		await timer.fastForward(Date.now())

		const now = getDateWithoutMilliseconds(new Date(timer.now()))
		const nowRoundDays = new Date(roundTimestamp(now.getTime(), { granularity: 'days' }))

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

		addSubscribedThread(thread, { channel, userData, timer, subscribedThreadsUpdater })

		thread.locked = true

		const changed = onSubscribedThreadFetched(thread, {
			timer,
			userData,
			min: true
		})

		// New data has been received. Returns `true`.
		expectToEqual(changed, true)

		expectToEqual(
			userData.getSubscribedThread('a', 100),
			{
				id: 100,
				channel,
				title: 'Anime 1',
				addedAt: now,
				updatedAt: now,
				locked: true
			}
		)
	})

	it('should reset subscribed thread errored state', async () => {
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

		addSubscribedThread(thread, { channel, userData, timer, subscribedThreadsUpdater })

		const stats = userData.getSubscribedThreadState('a', 100)

		stats.refreshErrorAt = now
		stats.refreshErrorCount = 1

		userData.setSubscribedThreadState('a', 100, stats)

		const changed = onSubscribedThreadFetched(thread, {
			timer,
			userData
		})

		// New data has been received. Returns `true`.
		expectToEqual(changed, true)

		expectToEqual(
			userData.getSubscribedThreadState('a', 100),
			{
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

	it('should reset subscribed thread errored state (catalog API response)', async () => {
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

		addSubscribedThread(thread, { channel, userData, timer, subscribedThreadsUpdater })

		const stats = userData.getSubscribedThreadState('a', 100)

		stats.refreshErrorAt = now
		stats.refreshErrorCount = 1

		userData.setSubscribedThreadState('a', 100, stats)

		const changed = onSubscribedThreadFetched(thread, {
			timer,
			userData,
			min: true
		})

		// New data has been received. Returns `true`.
		expectToEqual(changed, true)

		expectToEqual(
			userData.getSubscribedThreadState('a', 100),
			{
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
})