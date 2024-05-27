import SubscribedThreadsUpdater from './SubscribedThreadsUpdater.js'
import addSubscribedThread from '../subscribedThread/addSubscribedThread.js'

import UserData from '../../UserData/UserData.js'
import UserSettings from '../../utility/settings/UserSettings.js'
import DATA_SOURCES from '../../dataSources.js'

import { STATUS_RECORD_STORAGE_KEY } from './SubscribedThreadsUpdater.StatusRecord.js'

import { MemoryStorage } from 'web-browser-storage'
import { TestTab } from 'web-browser-tab'
import { TestTimer } from 'web-browser-timer'

describe('SubscribedThreadsUpdater', function() {
	it('should update subscribed threads', async function() {
		const storage = new MemoryStorage()
		const userData = new UserData(storage)
		const userSettings = new UserSettings(storage)

		const dataSource = DATA_SOURCES['4chan']

		let dispatchedActions = []

		const dispatch = async (action) => {
			switch (action.type) {
				case 'SUBSCRIBED_THREADS: GET_SUBSCRIBED_THREADS':
					action.value = undefined
					break
			}
			dispatchedActions.push(action)
		}

		const log = (tabId, ...args) => {
			if (args.length > 0) {
				console.log('[' + tabId + ']', '—', ...args)
			}
		}

		const timer = new TestTimer({
			log: (...args) => console.log('timer:', ...args)
		})

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

		addSubscribedThread({
			thread: thread1,
			// channel,
			dispatch,
			userData,
			timer,
			subscribedThreadsUpdater: subscribedThreadsUpdaterStub
		})

		addSubscribedThread({
			thread: thread2,
			// channel,
			dispatch,
			userData,
			timer,
			subscribedThreadsUpdater: subscribedThreadsUpdaterStub
		})

		addSubscribedThread({
			thread: thread3,
			// channel,
			dispatch,
			userData,
			timer,
			subscribedThreadsUpdater: subscribedThreadsUpdaterStub
		})

		// Skip some time so that after such a long time period
		// it will run the update procedure for all threads.
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

		let eventLog = []

		const eventLog_ = {
			push(entry) {
				eventLog.push(entry)
			}
		}

		const subscribedThreadsUpdater = new SubscribedThreadsUpdater({
			tab,
			log,
			timer,
			userData,
			userSettings,
			dataSource,
			storage,
			dispatch,
			eventLog: eventLog_,
			nextUpdateRandomizeInterval: 0,
			refreshThreadDelay: 1000,
			getThreadStub: async ({ channelId, threadId }) => {
				if (channelId === thread1.channelId && threadId === thread1.id) {
					return { thread: thread1 }
				} else if (channelId === thread2.channelId && threadId === thread2.id) {
					return { thread: thread2 }
				} else if (channelId === thread3.channelId && threadId === thread3.id) {
					return { thread: thread2 }
				} else {
					// Throw a "Not Found" error.
					const error = new Error('Not Found')
					error.status = 404
					throw error
				}
			}
		})

		subscribedThreadsUpdater.start()

		// The `tab` is set as "active" after `SubscribedThreadsUpdater` has been started.
		tab.setActive(true)

		expectToEqual(subscribedThreadsUpdater.getThreadsToUpdateNowAndNextUpdateTime(), {
			nextUpdateAt: undefined,
			subscribedThreadsToUpdate: [
				userData.getSubscribedThread(channel.id, thread1.id),
				userData.getSubscribedThread(channel.id, thread2.id)
			]
		})

		subscribedThreadsUpdater.status.should.equal('SCHEDULED')

		await timer.fastForward(2000)

		eventLog.should.deep.equal([
			{ event: 'START' },
			{ event: 'CHECK_IS_ACTIVE_TAB' },
			{ event: 'IS_INACTIVE_TAB' },
			{ event: 'SCHEDULE_UPDATE' },

			{ event: 'UPDATE_START' },
			{ event: 'CHECK_IS_ACTIVE_TAB' },
			{ event: 'IS_ACTIVE_TAB' },
			{ event: 'UPDATE_THREADS_START' },

			{ event: 'UPDATE_THREAD', channelId: channel.id, threadId: thread1.id },
			{ event: 'FETCH_THREAD_START', channelId: channel.id, threadId: thread1.id }
		])

		eventLog = []

		expectToEqual(
			storage.getData()[STATUS_RECORD_STORAGE_KEY],
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

		await timer.fastForward(3000)

		eventLog.should.deep.equal([
			{ event: 'FETCH_THREAD_END', channelId: channel.id, threadId: thread1.id },
			{ event: 'SCHEDULE_UPDATE_NEXT_THREAD' },

			{ event: 'UPDATE_THREAD', channelId: channel.id, threadId: thread2.id },
			{ event: 'FETCH_THREAD_START', channelId: channel.id, threadId: thread2.id },
			{ event: 'FETCH_THREAD_END', channelId: channel.id, threadId: thread2.id },
			{ event: 'UPDATE_THREADS_END' },
			{ event: 'UPDATE_END' },
			{ event: 'SCHEDULE_UPDATE' }
		])

		eventLog = []

		expectToEqual(
			storage.getData()[STATUS_RECORD_STORAGE_KEY],
			undefined
		)

		subscribedThreadsUpdater.status.should.equal('SCHEDULED')

		await timer.fastForward(100000)

		eventLog.should.deep.equal([
			{ event: 'UPDATE_START' },
			{ event: 'CHECK_IS_ACTIVE_TAB' },
			{ event: 'IS_ACTIVE_TAB' },
			{ event: 'UPDATE_THREADS_START' },

			{ event: 'UPDATE_THREAD', channelId: channel.id, threadId: thread1.id },
			{ event: 'FETCH_THREAD_START', channelId: channel.id, threadId: thread1.id },
			{ event: 'FETCH_THREAD_END', channelId: channel.id, threadId: thread1.id },

			{ event: 'UPDATE_THREADS_END' },
			{ event: 'UPDATE_END' },
			{ event: 'SCHEDULE_UPDATE' },

			{ event: 'UPDATE_START' },
			{ event: 'CHECK_IS_ACTIVE_TAB' },
			{ event: 'IS_ACTIVE_TAB' },
			{ event: 'UPDATE_THREADS_START' },

			{ event: 'UPDATE_THREAD', channelId: channel.id, threadId: thread2.id },
			{ event: 'FETCH_THREAD_START', channelId: channel.id, threadId: thread2.id },
			{ event: 'FETCH_THREAD_END', channelId: channel.id, threadId: thread2.id },

			{ event: 'UPDATE_THREADS_END' },
			{ event: 'UPDATE_END' },
			{ event: 'SCHEDULE_UPDATE' }
		])

		eventLog = []

		expectToEqual(
			storage.getData()[STATUS_RECORD_STORAGE_KEY],
			undefined
		)

		subscribedThreadsUpdater.status.should.equal('SCHEDULED')

		const thread1Stats = userData.getSubscribedThreadState(thread1.channelId, thread1.id)

		expectToEqual(thread1Stats.refreshedAt instanceof Date, true)
		expectToEqual(timer.now() - new Date(thread1Stats.refreshedAt).getTime() < 100000, true)

		// Validates that it has updated "subscribed thread" records.
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

		subscribedThreadsUpdater.getThreadsToUpdateNowAndNextUpdateTime().subscribedThreadsToUpdate.should.deep.equal([])

		subscribedThreadsUpdater.stop()
	})
})