import UserDataCleaner, { RUN_INTERVAL } from './UserDataCleaner.js'
import UserData from './UserData.js'
import getDateWithoutMilliseconds from '../utility/getDateWithoutMilliseconds.js'
import { MemoryStorage } from 'web-browser-storage'
import { TestTimer } from 'web-browser-timer'
import { TestTabStatusWatcher } from 'web-browser-tab/status-watcher'

describe('UserDataCleaner', function() {
	it('should clean User Data', async function() {
		const storage = new MemoryStorage()
		const userData = new UserData(storage, { userDataCleaner: true })

		const timer = new TestTimer({
			log: (...args) => console.log('timer:', ...args)
		})

		// `threadsAccessedAt` "granularity" is "days",
		// so data lifetime should be at least several days.
		const UNUSED_THREAD_DATA_LIFETIME = 7 * 24 * 60 * 60 * 1000

		// Discard milliseconds
		const recentDate = getDateWithoutMilliseconds(new Date(timer.now()))
		const tooOldDate = new Date(recentDate.getTime() - UNUSED_THREAD_DATA_LIFETIME * 2)

		userData.addOwnThread('a', 123)
		userData.addOwnComment('a', 123, 123)

		userData.addSubscribedThread({
			id: 123,
			channel: {
				id: 'a',
				title: 'Anime'
			},
			title: 'Thread 1',
			addedAt: tooOldDate
		})

		userData.addOwnThread('b', 456)
		userData.addOwnComment('b', 456, 456)

		userData.addSubscribedThread({
			id: 456,
			channel: {
				id: 'b',
				title: 'Random'
			},
			title: 'Thread 2',
			addedAt: tooOldDate
		})

		userData.addOwnThread('c', 789)
		userData.addOwnComment('c', 789, 789)

		userData.addSubscribedThread({
			id: 789,
			channel: {
				id: 'c',
				title: 'Comic'
			},
			title: 'Thread 3',
			addedAt: recentDate
		})

		// Add a non-existent `subscribedThread` to subscribed threads index.
		userData.addSubscribedThreadIdForChannel('c', 111)

		// Don't add existing `subscribedThread`s to subscribed threads indexes
		// of channels `a` and `b`.

		// All threads are archived or expired,
		// so that all of them are generally clean-able.
		userData.setThreads('a', [])
		userData.setThreads('b', [])
		userData.setThreads('c', [])

		userData.setThreadAccessedAt('a', 123, recentDate)
		userData.setThreadAccessedAt('b', 456, tooOldDate)
		// No "latest accessed at" date for `/c/789` thread. Will get cleaned up.

		expectToEqual(
			userData.getSubscribedThread('a', 123),
			{
				id: 123,
				channel: {
					id: 'a',
					title: 'Anime'
				},
				title: 'Thread 1',
				addedAt: tooOldDate
			}
		)

		expectToEqual(
			userData.getSubscribedThread('b', 456),
			{
				id: 456,
				channel: {
					id: 'b',
					title: 'Random'
				},
				title: 'Thread 2',
				addedAt: tooOldDate
			}
		)

		expectToEqual(
			userData.getSubscribedThread('c', 789),
			{
				id: 789,
				channel: {
					id: 'c',
					title: 'Comic'
				},
				title: 'Thread 3',
				addedAt: recentDate
			}
		)

		const tabStatusWatcher = new TestTabStatusWatcher()

		const userDataCleaner = new UserDataCleaner({
			storage,
			userData,
			tabStatusWatcher,
			unusedThreadDataLifeTime: UNUSED_THREAD_DATA_LIFETIME,
			startDelayMax: 0,
			timer
		})

		tabStatusWatcher.setActive(true)

		expectToEqual(
			userDataCleaner.getNextCleanUpDelay(),
			0
		)

		userDataCleaner.start()

		// await new Promise(resolve => setTimeout(resolve, 1000000))

		// Wait for User Data Cleaner to acquire a lock.
		await timer.fastForward(1000)

		// Shouldn't clean up "still used" (recent) threads data.
		expectToEqual(
			userData.getSubscribedThread('a', 123),
			{
				id: 123,
				channel: {
					id: 'a',
					title: 'Anime'
				},
				title: 'Thread 1',
				addedAt: tooOldDate
			}
		)

		// The clean-up procedure also fixes corrupt thread data.
		// In this case, it should've re-created a missing "thread stats" record.
		expectToEqual(
			userData.getSubscribedThreadState('a', 123),
			{
				refreshedAt: tooOldDate,
				latestComment: {
					id: 123,
					createdAt: tooOldDate
				},
				commentsCount: 1,
				newCommentsCount: 0,
				newRepliesCount: 0
			}
		)

		// Thread data doesn't get cleaned up yet.
		// (is not stale enough).
		expectToEqual(userData.isOwnThread('a', 123), true)
		expectToEqual(userData.isOwnComment('a', 123, 123), true)

		// Doesn't clean up `subscribedThreads` collection,
		// even when it's "unused" (old) threads data.
		expectToEqual(
			userData.getSubscribedThread('b', 456).id,
			456
		)
		// Doesn't clean up `subscribedThreadsStats` collection,
		// even when it's "unused" (old) threads data.
		expectToEqual(
			userData.getSubscribedThreadState('b', 456).commentsCount,
			1
		)

		// Thread data gets cleaned up (is stale enough).
		expectToEqual(userData.isOwnThread('b', 456), false)
		expectToEqual(userData.isOwnComment('b', 456, 456), false)

		// There was no "latest accessed at" date for `/c/789` thread,
		// and the thread itself is either archived or expired.
		// Should've been cleaned up.

		// Doesn't clean up `subscribedThreads` collection,
		// even when it's "unused" (old) threads data.
		expectToEqual(
			userData.getSubscribedThread('c', 789).id,
			789
		)
		// Doesn't clean up `subscribedThreadsStats` collection,
		// even when it's "unused" (old) threads data.
		expectToEqual(
			userData.getSubscribedThreadState('c', 789).commentsCount,
			1
		)

		// Thread data gets cleaned up (hasn't been accessed at all).
		expectToEqual(userData.isOwnThread('c', 789), false)
		expectToEqual(userData.isOwnComment('c', 789, 789), false)

		expectToEqual(
			userDataCleaner.getNextCleanUpDelay() < RUN_INTERVAL,
			true
		)

		expectToEqual(
			userDataCleaner.getNextCleanUpDelay() > RUN_INTERVAL - timer.now(),
			true
		)

		userDataCleaner.stop()
	})
})