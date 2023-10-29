import SubscribedThreadsUpdater from './SubscribedThreadsUpdater.js'
import addSubscribedThread from '../subscribedThread/addSubscribedThread.js'

import UserData from '../../UserData/UserData.js'
import UserSettings from '../../utility/settings/UserSettings.js'
import DATA_SOURCES from '../../dataSources.js'

import { MemoryStorage } from 'web-browser-storage'
import { TestTab } from 'web-browser-tab'
import { TestTimer } from 'web-browser-timer'

describe('SubscribedThreadsUpdater/tab', function() {
	it('should work for a single active tab (has updates)', async function() {
		const storage = new MemoryStorage()
		const userData = new UserData(storage)
		const userSettings = new UserSettings(storage)
		const dataSource = DATA_SOURCES['4chan']

		const timer = new TestTimer()

		const tab = new TestTab({
			id: '1',
			storage: storage,
			timer
		})

		tab.setActive(true)

		const oldDate = new Date(timer.now())

		const channel = {
			id: 'a',
			title: 'Anime'
		}

		const thread1 = {
			id: 1,
			channelId: channel.id,
			title: 'Thread 1',
			createdAt: oldDate,
			commentsCount: 1,
			attachmentsCount: 0,
			comments: [{
				id: 1,
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

		userData.setLatestReadCommentId(
			channel.id,
			thread1.id,
			thread1.comments[thread1.comments.length - 1].id
		)

		addSubscribedThread(thread1, {
			channel,
			userData,
			timer,
			subscribedThreadsUpdater: subscribedThreadsUpdaterStub
		})

		userData.getSubscribedThreadState(channel.id, thread1.id).newCommentsCount.should.equal(0)

		await timer.fastForward(24 * 60 * 60 * 1000)

		const minuteBeforeStartedAt = new Date(timer.now())

		await timer.fastForward(60 * 1000)

		const startedAt = new Date(timer.now())

		thread1.comments.push({
			id: 2,
			content: 'Comment 2',
			createdAt: minuteBeforeStartedAt
		})

		subscribedThreadsUpdaterStub.wasReset.should.equal(true)

		let dispatchedActions = []

		const dispatch = (action) => {
			switch (action.type) {
				case 'SUBSCRIBED_THREADS: GET_SUBSCRIBED_THREADS':
					action.value = undefined
					break
			}
			dispatchedActions.push(action)
		}

		let eventLog = []

		const subscribedThreadsUpdater = new SubscribedThreadsUpdater({
			tab,
			timer,
			userData,
			userSettings,
			dataSource,
			storage,
			dispatch,
			eventLog,
			nextUpdateRandomizeInterval: 0,
			getThreadStub: async ({ channelId, threadId }) => {
				dispatch({
					type: 'GET_THREAD',
					value: {
						channelId,
						threadId
					}
				})
				await timer.waitFor(10000)
				if (channelId === thread1.channelId && threadId === thread1.id) {
					return thread1
				} else {
					throw new Error(`Thread not found: /${channelId}/${threadId}`)
				}
			}
		})

		expect(subscribedThreadsUpdater.status).to.be.undefined

		subscribedThreadsUpdater.start()
		subscribedThreadsUpdater.status.should.equal('UPDATE')

		await timer.fastForward(20000)

		// Scheduled a next update.
		subscribedThreadsUpdater.status.should.equal('SCHEDULED')

		eventLog.should.deep.equal([
			{ event: 'START' },

			{ event: 'CHECK_IS_ACTIVE_TAB' },
			{ event: 'IS_ACTIVE_TAB' },

			{ event: 'UPDATE_START' },

			{ event: 'GET_IS_ACTIVE_TAB' },
			{ event: 'IS_ACTIVE_TAB' },

			{ event: 'UPDATE_THREADS_START' },

			{ event: 'UPDATE_THREAD', channelId: channel.id, threadId: thread1.id },
			{ event: 'FETCH_THREAD_START', channelId: channel.id, threadId: thread1.id },
			{ event: 'FETCH_THREAD_END', channelId: channel.id, threadId: thread1.id },

			{ event: 'UPDATE_THREADS_END' },

			{ event: 'UPDATE_END' },

			{ event: 'SCHEDULE_UPDATE' }
		])

		// dispatchedActions.should.deep.equal([
		// 	// Subscribed Threads Update has started.
		// 	// A subscribed thread will be updated.
		// 	{
		// 		type: 'SUBSCRIBED_THREADS: UPDATE_IN_PROGRESS_FOR_THREAD',
		// 		value: {
		// 			channelId: channel.id,
		// 			threadId: thread1.id
		// 		}
		// 	},
		// 	// A subscribed thread is fetched.
		// 	{
		// 		type: 'GET_THREAD',
		// 		value: {
		// 			channelId: channel.id,
		// 			threadId: thread1.id
		// 		}
		// 	},
		// 	// It seems that it no longer fetches subscribed threads in `SubscribedThreadsUpdater.js`.
		// 	// // A subscribed thread has been fetched.
		// 	// // Update the list of subscribed threads in the sidebar.
		// 	// {
		// 	// 	type: 'SUBSCRIBED_THREADS: GET_SUBSCRIBED_THREADS',
		// 	// 	value: undefined
		// 	// },
		// 	// Not updating any subscribed thread at the moment.
		// 	{
		// 		type: 'SUBSCRIBED_THREADS: UPDATE_IN_PROGRESS_FOR_THREAD',
		// 		value: {
		// 			channelId: undefined,
		// 			threadId: undefined
		// 		}
		// 	},
		// 	// Subscribed Threads Update has finished.
		// 	{
		// 		type: 'SUBSCRIBED_THREADS: UPDATE_NOT_IN_PROGRESS',
		// 		value: undefined
		// 	}
		// ])

		subscribedThreadsUpdater.stop()

		userData.getSubscribedThreadState(channel.id, thread1.id).newCommentsCount.should.equal(1)
	})
})