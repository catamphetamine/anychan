import SubscribedThreadsUpdater from './SubscribedThreadsUpdater.js'
import addSubscribedThread from '../subscribedThread/addSubscribedThread.js'

import UserData from '../../UserData/UserData.js'
import UserSettings from '../../UserSettings/UserSettings.js'
import DATA_SOURCES from '../../dataSources.js'

import { BASE_PREFIX } from '../storage/getStoragePrefix.js'

import { MemoryStorage } from 'web-browser-storage'
import { TestTab } from 'web-browser-tab'
import { TestTimer } from 'web-browser-timer'

describe('SubscribedThreadsUpdater', function() {
	it('should update subscribed threads', async function() {
		const storage = new MemoryStorage()
		const userData = new UserData(storage)
		const userSettings = new UserSettings(storage)

		const dataSource = DATA_SOURCES['4chan']

		const timer = new TestTimer()

		const tab = new TestTab({
			id: '1',
			storage,
			timer
		})

		const oldDate = new Date(timer.now())

		const channel = {
			id: 'a',
			title: 'Anime'
		}

		const thread1 = {
			id: 10,
			channelId: channel.id,
			title: 'Thread 1',
			createdAt: oldDate,
			commentsCount: 1,
			attachmentsCount: 0,
			comments: [{
				id: 10,
				content: 'Comment 1',
				createdAt: oldDate
			}]
		}

		const thread2 = {
			id: 20,
			channelId: channel.id,
			title: 'Thread 2',
			createdAt: oldDate,
			commentsCount: 1,
			attachmentsCount: 0,
			comments: [{
				id: 20,
				content: 'Comment 1',
				createdAt: oldDate
			}]
		}

		// This thread is "locked" so it gets skipped.
		const thread3 = {
			id: 30,
			channelId: channel.id,
			title: 'Thread 3',
			createdAt: oldDate,
			commentsCount: 1,
			attachmentsCount: 0,
			locked: true,
			comments: [{
				id: 30,
				content: 'Comment 1',
				createdAt: oldDate
			}]
		}

		const subscribedThreadsUpdaterStub = {
			wasReset: false,
			reset() {
				this.wasReset = true
			}
		}

		userData.setLatestReadCommentId(thread1.channelId, thread1.id, thread1.id)
		userData.setLatestReadCommentId(thread2.channelId, thread2.id, thread2.id)
		userData.setLatestReadCommentId(thread3.channelId, thread3.id, thread3.id)

		addSubscribedThread(thread1, { channel, userData, timer, subscribedThreadsUpdater: subscribedThreadsUpdaterStub })
		addSubscribedThread(thread2, { channel, userData, timer, subscribedThreadsUpdater: subscribedThreadsUpdaterStub })
		addSubscribedThread(thread3, { channel, userData, timer, subscribedThreadsUpdater: subscribedThreadsUpdaterStub })

		await timer.fastForward(24 * 60 * 60 * 1000)

		const startedAt = new Date(timer.now())

		thread1.comments.push({
			id: 11,
			content: 'Comment 2',
			createdAt: startedAt
		})

		thread2.comments.push({
			id: 21,
			content: 'Comment 2',
			createdAt: startedAt
		})

		thread3.comments.push({
			id: 31,
			content: 'Comment 2',
			createdAt: startedAt
		})

		let dispatchedActions = []

		const dispatch = async (action) => {
			switch (action.type) {
				case 'SUBSCRIBED_THREADS: GET_SUBSCRIBED_THREADS':
					action.value = undefined
					break
			}

			dispatchedActions.push(action)

			if (action.type === 'GET_THREAD') {
				await timer.waitFor(10000)

				// Fetch Thread 1.
				if (action.value.channelId === thread1.channelId && action.value.threadId === thread1.id) {
					return thread1
				}

				// Fetch Thread 2.
				if (action.value.channelId === thread2.channelId && action.value.threadId === thread2.id) {
					return thread2
				}

				// Fetch Thread 3.
				if (action.value.channelId === thread3.channelId && action.value.threadId === thread3.id) {
					return thread3
				}

				// Throw a "Not Found" error.
				const error = new Error('Not Found')
				error.status = 404
				throw error
			}
		}

		const subscribedThreadsUpdater = new SubscribedThreadsUpdater({
			tab,
			timer,
			userData,
			userSettings,
			dataSource,
			storage,
			dispatch,
			nextUpdateRandomizeInterval: 0,
			getThreadStub: (channelId, threadId) => {
				return dispatch({
					type: 'GET_THREAD',
					value: {
						channelId,
						threadId
					}
				})
			}
		})

		subscribedThreadsUpdater.start()

		tab.setActive(true)

		expectToEqual(subscribedThreadsUpdater.getThreadsToUpdateNowAndNextUpdateTime(), {
			nextUpdateAt: undefined,
			subscribedThreadsToUpdate: [
				userData.getSubscribedThread(channel.id, thread1.id),
				userData.getSubscribedThread(channel.id, thread2.id)
			]
		})

		subscribedThreadsUpdater.status.should.equal('SCHEDULED')

		await timer.fastForward(5000)

		dispatchedActions.should.deep.equal([
			// Will update Thread 1.
			{
				type: 'SUBSCRIBED_THREADS: UPDATE_IN_PROGRESS_FOR_THREAD',
				value: {
					channelId: thread1.channelId,
					threadId: thread1.id
				}
			},
			// Fetch Thread 1.
			{
				type: 'GET_THREAD',
				value: {
					channelId: thread1.channelId,
					threadId: thread1.id
				}
			}
		])

		dispatchedActions = []

		expectToEqual(
			storage.getData()[BASE_PREFIX + 'subscribedThreadUpdate'],
			{
				processId: tab.getId(),
				createdAt: 86401000,
				startedAt: 86401150,
				activeAt: 86401150,
				channelId: channel.id,
				threadId: thread1.id
			}
		)

		subscribedThreadsUpdater.status.should.equal('UPDATE')

		await timer.fastForward(10000)

		dispatchedActions.should.deep.equal([
			// Subscribed Thread 1 has been fetched.
			// Update the list of subscribed threads in the sidebar.
			{
				type: 'SUBSCRIBED_THREADS: GET_SUBSCRIBED_THREADS',
				value: undefined
			},
			// Finished updating Subscribed Thread 1.
			{
				type: 'SUBSCRIBED_THREADS: UPDATE_IN_PROGRESS_FOR_THREAD',
				value: {
					channelId: undefined,
					threadId: undefined
				}
			}
		])

		dispatchedActions = []

		expectToEqual(
			storage.getData()[BASE_PREFIX + 'subscribedThreadUpdate'],
			{
				processId: tab.getId(),
				createdAt: 86401000,
				startedAt: 86401150,
				activeAt: 86415000,
				channelId: undefined,
				threadId: undefined
			}
		)

		subscribedThreadsUpdater.status.should.equal('UPDATE')

		await timer.fastForward(10000)

		expectToEqual(dispatchedActions, [
			// Will update Thread 2.
			{
				type: 'SUBSCRIBED_THREADS: UPDATE_IN_PROGRESS_FOR_THREAD',
				value: {
					channelId: thread2.channelId,
					threadId: thread2.id
				}
			},
			// Fetch Thread 2.
			{
				type: 'GET_THREAD',
				value: {
					channelId: thread2.channelId,
					threadId: thread2.id
				}
			}
		])

		dispatchedActions = []

		expectToEqual(
			storage.getData()[BASE_PREFIX + 'subscribedThreadUpdate'],
			{
				processId: tab.getId(),
				createdAt: 86401000,
				startedAt: 86401150,
				activeAt: 86416000,
				channelId: channel.id,
				threadId: thread2.id
			}
		)

		subscribedThreadsUpdater.status.should.equal('UPDATE')

		await timer.fastForward(1000)

		dispatchedActions.should.deep.equal([
			// Subscribed Thread 2 has been fetched.
			// Update the list of subscribed threads in the sidebar.
			{
				type: 'SUBSCRIBED_THREADS: GET_SUBSCRIBED_THREADS',
				value: undefined
			},
			// Finished updating Subscribed Thread 2.
			{
				type: 'SUBSCRIBED_THREADS: UPDATE_IN_PROGRESS_FOR_THREAD',
				value: {
					channelId: undefined,
					threadId: undefined
				}
			}
		])

		dispatchedActions = []

		await timer.fastForward(1000)

		dispatchedActions.should.deep.equal([
			// Finished Subscribed Threads Update.
			{
				type: 'SUBSCRIBED_THREADS: UPDATE_NOT_IN_PROGRESS',
				value: undefined
			}
		])

		dispatchedActions = []

		subscribedThreadsUpdater.status.should.equal('SCHEDULED')

		expectToEqual(storage.getData()[BASE_PREFIX + 'subscribedThreadUpdate'], undefined)

		const thread1Stats = userData.getSubscribedThreadStats(thread1.channelId, thread1.id)

		expectToEqual(thread1Stats.refreshedAt instanceof Date, true)
		expectToEqual(timer.now() - thread1Stats.refreshedAt.getTime() < 20000, true)

		expectToEqual(thread1Stats, {
			refreshedAt: thread1Stats.refreshedAt,
			commentsCount: thread1.comments.length,
			newCommentsCount: 1,
			newRepliesCount: 0,
			latestComment: {
				id: thread1.comments[thread1.comments.length - 1].id,
				createdAt: thread1.comments[thread1.comments.length - 1].createdAt
			}
		})

		expectToEqual(subscribedThreadsUpdater.getThreadsToUpdateNowAndNextUpdateTime(), {
			nextUpdateAt: 86471000,
			subscribedThreadsToUpdate: []
		})

		subscribedThreadsUpdater.stop()
	})
})