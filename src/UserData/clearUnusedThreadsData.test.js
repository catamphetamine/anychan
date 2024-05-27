import { MemoryStorage } from 'web-browser-storage'
import { TestTimer } from 'web-browser-timer'
import UserData from './UserData.js'
import getDateWithoutMilliseconds from '../utility/getDateWithoutMilliseconds.js'

import clearUnusedThreadsData from './clearUnusedThreadsData.js'

describe('clearUnusedThreadsData', function() {
	it('should clear unused thread data', async function() {
		const storage = new MemoryStorage()
		const userData = new UserData(storage)

		const timer = new TestTimer({
			log: (...args) => console.log('timer:', ...args)
		})

		// Discard milliseconds
		const date = getDateWithoutMilliseconds(new Date(0))

		userData.addSubscribedThread({
			id: 123,
			channel: {
				id: 'a',
				title: 'Anime'
			},
			title: 'Thread 1',
			addedAt: date
		})

		userData.addSubscribedThread({
			id: 456,
			channel: {
				id: 'b',
				title: 'Random'
			},
			title: 'Thread 2',
			addedAt: date
		})

		userData.setSubscribedThreadState('a', 123, {
			refreshedAt: date,
			latestComment: {
				id: 123,
				createdAt: date
			},
			commentsCount: 1,
			newCommentsCount: 1,
			newRepliesCount: 1
		})

		userData.setSubscribedThreadState('b', 456, {
			refreshedAt: date,
			latestComment: {
				id: 456,
				createdAt: date
			},
			commentsCount: 1,
			newCommentsCount: 1,
			newRepliesCount: 1
		})

		userData.addOwnThread('a', 123)
		userData.addOwnThread('b', 456)

		userData.addOwnComment('a', 123, 123)
		userData.addOwnComment('a', 123, 124)
		userData.addOwnComment('b', 456, 456)
		userData.addOwnComment('b', 456, 457)

		userData.setThreadVote('a', 111, 1)
		userData.setThreadVote('a', 123, 1)
		userData.setThreadVote('b', 456, 1)

		userData.setCommentVote('a', 123, 123, 1)
		userData.setCommentVote('a', 123, 124, 1)
		userData.setCommentVote('b', 456, 456, 1)
		userData.setCommentVote('b', 456, 457, 1)

		userData.setThreads('a', [111])
		userData.setThreads('b', [456])

		const DAY = 24 * 60 * 60 * 1000

		await timer.fastForward(1.5 * DAY)

		// The thread in `/a/` hasn't been accessed for a long time, if ever.
		// The thread in `/b/` has been accessed  recently.
		userData.setThreadAccessedAt('b', 456, new Date(timer.now()))

		const clear = clearUnusedThreadsData({
			userData,
			unusedThreadDataLifeTime: DAY,
			timer
		})
		clear()

		// Subscribed threads collection doesn't get cleared.

		const subscribedThreadA = userData.getSubscribedThread('a', 123)
		const subscribedThreadB = userData.getSubscribedThread('b', 456)

		expectToEqual(
			subscribedThreadA,
			{
				id: 123,
				channel: {
					id: 'a',
					title: 'Anime'
				},
				title: 'Thread 1',
				addedAt: date
			}
		)

		expectToEqual(
			subscribedThreadB,
			{
				id: 456,
				channel: {
					id: 'b',
					title: 'Random'
				},
				title: 'Thread 2',
				addedAt: date
			}
		)

		// `subscribedThreadState` collection doesn't get cleared.
		expectToEqual(
			userData.getSubscribedThreadState('a', 123),
			{
				refreshedAt: date,
				latestComment: {
					id: 123,
					createdAt: date
				},
				commentsCount: 1,
				newCommentsCount: 1,
				newRepliesCount: 1
			}
		)

		expectToEqual(
			userData.getSubscribedThreadState('b', 456),
			{
				refreshedAt: date,
				latestComment: {
					id: 456,
					createdAt: date
				},
				commentsCount: 1,
				newCommentsCount: 1,
				newRepliesCount: 1
			}
		)

		// `subscribedThreadsIndex` collection doesn't get cleared.
		expectToEqual(userData.getSubscribedThread('a', 123).id, 123)
		expectToEqual(userData.getSubscribedThread('b', 456).id, 456)

		expectToEqual(userData.isOwnThread('a', 123), false)
		expectToEqual(userData.isOwnThread('b', 456), true)

		expectToEqual(userData.isOwnComment('a', 123, 123), false)
		expectToEqual(userData.isOwnComment('a', 123, 124), false)
		expectToEqual(userData.isOwnComment('b', 456, 457), true)

		expectToEqual(userData.getThreadVote('a', 111), 1)
		expectToEqual(userData.getThreadVote('a', 123), undefined)
		expectToEqual(userData.getThreadVote('b', 456), 1)

		expectToEqual(userData.getCommentVote('a', 123, 124), undefined)
		expectToEqual(userData.getCommentVote('b', 456, 457), 1)
	})

	it('should not clear expired threads that have not exceeded their lifetime', function() {
		const storage = new MemoryStorage()
		const userData = new UserData(storage)

		const timer = new TestTimer({
			log: (...args) => console.log('timer:', ...args)
		})

		const DAY = 24 * 60 * 60 * 1000

		const date = new Date(timer.now())

		userData.setThreadAccessedAt('a', 123, new Date(date.getTime() - 7 * DAY))
		userData.setThreadAccessedAt('b', 456, new Date(date.getTime() - 1 * DAY))

		userData.addOwnThread('a', 123)
		userData.addOwnThread('b', 456)

		userData.addOwnComment('a', 123, 123)
		userData.addOwnComment('a', 123, 124)
		userData.addOwnComment('b', 456, 456)
		userData.addOwnComment('b', 456, 457)

		userData.setThreadVote('a', 123, 1)
		userData.setThreadVote('b', 456, 1)

		userData.setCommentVote('a', 123, 124, 1)
		userData.setCommentVote('b', 456, 457, 1)

		userData.setThreads('a', [111])
		userData.setThreads('b', [456])

		const clear = clearUnusedThreadsData({
			userData,
			unusedThreadDataLifeTime: 3 * DAY,
			timer
		})
		clear()

		expectToEqual(userData.isOwnThread('a', 123), false)
		expectToEqual(userData.isOwnThread('b', 456), true)

		expectToEqual(userData.isOwnComment('a', 123, 124), false)
		expectToEqual(userData.isOwnComment('b', 456, 457), true)

		expectToEqual(userData.getThreadVote('a', 123), undefined)
		expectToEqual(userData.getThreadVote('b', 456), 1)

		expectToEqual(userData.getCommentVote('a', 123, 124), undefined)
		expectToEqual(userData.getCommentVote('b', 456, 457), 1)
	})
})