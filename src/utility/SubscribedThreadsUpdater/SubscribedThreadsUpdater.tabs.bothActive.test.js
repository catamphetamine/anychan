import SubscribedThreadsUpdater from './SubscribedThreadsUpdater.js'
import addSubscribedThread from '../subscribedThread/addSubscribedThread.js'

import UserData from '../../UserData/UserData.js'
import UserSettings from '../../utility/settings/UserSettings.js'
import DATA_SOURCES from '../../dataSources.js'

import { MemoryStorage } from 'web-browser-storage'
import { TestTab } from 'web-browser-tab'
import { TestTimer } from 'web-browser-timer'

describe('SubscribedThreadsUpdater/tabs', function() {
	it('should work between tabs (both are active)', async function() {
		const baseStorage = new MemoryStorage()

		const storage1 = baseStorage.createSharedInstance('1')
		const storage2 = baseStorage.createSharedInstance('2')

		const userData1 = new UserData(storage1)
		const userData2 = new UserData(storage2)

		const userSettings = new UserSettings(storage1)

		const dataSource = DATA_SOURCES['4chan']

		const timer = new TestTimer()

		const tab1 = new TestTab({
			id: '1 (active tab)',
			storage: storage1,
			timer
		})

		const tab2 = new TestTab({
			id: '2 (active tab)',
			storage: storage1,
			timer
		})

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

		const thread2 = {
			id: 2,
			channelId: channel.id,
			title: 'Thread 2',
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

		addSubscribedThread(thread1, {
			channel,
			userData: userData1,
			timer,
			subscribedThreadsUpdater: subscribedThreadsUpdaterStub
		})

		addSubscribedThread(thread2, {
			channel,
			userData: userData1,
			timer,
			subscribedThreadsUpdater: subscribedThreadsUpdaterStub
		})

		addSubscribedThread(thread1, {
			channel,
			userData: userData2,
			timer,
			subscribedThreadsUpdater: subscribedThreadsUpdaterStub
		})

		addSubscribedThread(thread2, {
			channel,
			userData: userData2,
			timer,
			subscribedThreadsUpdater: subscribedThreadsUpdaterStub
		})

		subscribedThreadsUpdaterStub.wasReset.should.equal(true)

		let eventLog = []

		const eventLog1 = {
			push: (event) => {
				eventLog.push({
					...event,
					tab: 1
				})
			}
		}

		const eventLog2 = {
			push: (event) => {
				eventLog.push({
					...event,
					tab: 2
				})
			}
		}

		let dispatchedActions = []

		const dispatch = (action, tab) => {
			switch (action.type) {
				case 'SUBSCRIBED_THREADS: GET_SUBSCRIBED_THREADS':
					action.value = undefined
					break
			}

			dispatchedActions.push({
				tab: tab === tab1 ? 1 : 2,
				...action
			})
		}

		const dispatch1 = (action) => dispatch(action, tab1)
		const dispatch2 = (action) => dispatch(action, tab2)

		await timer.fastForward(24 * 60 * 60 * 1000)

		const minuteBeforeStartedAt = new Date(timer.now())

		await timer.fastForward(60 * 1000)

		const startedAt = new Date(timer.now())

		thread1.comments.push({
			id: 2,
			content: 'Comment 2',
			createdAt: minuteBeforeStartedAt
		})

		thread2.comments.push({
			id: 2,
			content: 'Comment 2',
			createdAt: minuteBeforeStartedAt
		})

		const subscribedThreadsUpdater1 = new SubscribedThreadsUpdater({
			tab: tab1,
			userData: userData1,
			userSettings,
			dataSource,
			storage: storage1,
			dispatch: dispatch1,
			timer,
			eventLog: eventLog1,
			nextUpdateRandomizeInterval: 0,
			getThreadStub: async ({ channelId, threadId }) => {
				dispatch1({
					type: 'GET_THREAD',
					value: {
						channelId,
						threadId
					}
				})
				await timer.waitFor(1000)
				if (channelId === thread1.channelId && threadId === thread1.id) {
					return thread1
				} else if (channelId === thread2.channelId && threadId === thread2.id) {
					return thread2
				} else {
					throw new Error(`Thread not found: /${channelId}/${threadId}`)
				}
			}
		})

		const subscribedThreadsUpdater2 = new SubscribedThreadsUpdater({
			tab: tab2,
			userData: userData2,
			userSettings,
			dataSource,
			storage: storage2,
			dispatch: dispatch2,
			timer,
			eventLog: eventLog2,
			nextUpdateRandomizeInterval: 0,
			getThreadStub: async ({ channelId, threadId }) => {
				dispatch2({
					type: 'GET_THREAD',
					value: {
						channelId,
						threadId
					}
				})
				await timer.waitFor(1000)
				if (channelId === thread1.channelId && threadId === thread1.id) {
					return thread1
				} else if (channelId === thread2.channelId && threadId === thread2.id) {
					return thread2
				} else {
					throw new Error(`Thread not found: /${channelId}/${threadId}`)
				}
			}
		})

		expect(subscribedThreadsUpdater1.status).to.be.undefined
		expect(subscribedThreadsUpdater2.status).to.be.undefined

		await subscribedThreadsUpdater1.start()
		await subscribedThreadsUpdater2.start()

		subscribedThreadsUpdater1.status.should.equal('SCHEDULED')
		subscribedThreadsUpdater2.status.should.equal('SCHEDULED')

		subscribedThreadsUpdater1.getThreadsToUpdateNowAndNextUpdateTime().should.deep.equal({
			nextUpdateAt: undefined,
			subscribedThreadsToUpdate: [
				userData1.getSubscribedThread(channel.id, thread1.id),
				userData1.getSubscribedThread(channel.id, thread2.id)
			]
		})

		subscribedThreadsUpdater2.getThreadsToUpdateNowAndNextUpdateTime().should.deep.equal({
			nextUpdateAt: undefined,
			subscribedThreadsToUpdate: [
				userData2.getSubscribedThread(channel.id, thread1.id),
				userData2.getSubscribedThread(channel.id, thread2.id)
			]
		})

		// `tab.setActive()` call should be made after `SubscribedThreadsUpdater.start()` has been called.
		// Otherwise, if the order of the calls is different, it won't do anything (the test will timeout).
		tab1.setActive(true)
		tab2.setActive(true)

		await timer.fastForward(2000)

		subscribedThreadsUpdater1.status.should.equal('UPDATE')

		await timer.fastForward(8000)

		subscribedThreadsUpdater1.status.should.equal('SCHEDULED')

		// "Wait and retry. Reason: CONCURRENT_UPDATE_IN_PROGRESS".
		subscribedThreadsUpdater2.status.should.equal('SCHEDULED')

		// Tab 2 is still waiting for `STATUS_RECORD_CREATION_REPEATABLE_READ_CHECK_INTERVAL`
		// at this point.

		eventLog.should.deep.equal([
			// `subscribedThreadsUpdater1.start()` has been called.
			// `tab1.setActive(true)` hasn't been called yet.
			{ tab: 1, event: 'START' },
			{ tab: 1, event: 'CHECK_IS_ACTIVE_TAB' },
			{ tab: 1, event: 'IS_INACTIVE_TAB' },
			{ tab: 1, event: 'SCHEDULE_UPDATE' },

			// `subscribedThreadsUpdater2.start()` has been called.
			// `tab2.setActive(true)` hasn't been called yet.
			{ tab: 2, event: 'START' },
			{ tab: 2, event: 'CHECK_IS_ACTIVE_TAB' },
			{ tab: 2, event: 'IS_INACTIVE_TAB' },
			{ tab: 2, event: 'SCHEDULE_UPDATE' },

			{ tab: 1, event: 'UPDATE_START' },
			{ tab: 1, event: 'GET_IS_ACTIVE_TAB' },
			{ tab: 1, event: 'IS_ACTIVE_TAB' },
			{ tab: 1, event: 'UPDATE_THREADS_START' },

			{ tab: 2, event: 'UPDATE_START' },
			{ tab: 2, event: 'GET_IS_ACTIVE_TAB' },
			{ tab: 2, event: 'IS_ACTIVE_TAB' },
			{ tab: 2, event: 'WAIT_AND_RETRY', reason: 'CONCURRENT_UPDATE_IN_PROGRESS' },
			{ tab: 2, event: 'UPDATE_END' },
			{ tab: 2, event: 'SCHEDULE_UPDATE' },

			{ tab: 1, event: 'UPDATE_THREAD', channelId: channel.id, threadId: thread1.id },
			{ tab: 1, event: 'FETCH_THREAD_START', channelId: channel.id, threadId: thread1.id },

			{ tab: 2, event: 'UPDATE_START' },
			{ tab: 2, event: 'GET_IS_ACTIVE_TAB' },
			{ tab: 2, event: 'IS_ACTIVE_TAB' },
			{ tab: 2, event: 'WAIT_AND_RETRY', reason: 'CONCURRENT_UPDATE_IN_PROGRESS' },
			{ tab: 2, event: 'UPDATE_END' },
			{ tab: 2, event: 'SCHEDULE_UPDATE' },

			{ tab: 1, event: 'FETCH_THREAD_END', channelId: channel.id, threadId: thread1.id },
			{ tab: 1, event: 'SCHEDULE_UPDATE_NEXT_THREAD' },

			{ tab: 1, event: 'UPDATE_THREAD', channelId: channel.id, threadId: thread2.id },
			{ tab: 1, event: 'FETCH_THREAD_START', channelId: channel.id, threadId: thread2.id },

			{ tab: 2, event: 'UPDATE_START' },
			{ tab: 2, event: 'GET_IS_ACTIVE_TAB' },
			{ tab: 2, event: 'IS_ACTIVE_TAB' },
			{ tab: 2, event: 'WAIT_AND_RETRY', reason: 'CONCURRENT_UPDATE_IN_PROGRESS' },
			{ tab: 2, event: 'UPDATE_END' },
			{ tab: 2, event: 'SCHEDULE_UPDATE' },

			{ tab: 2, event: 'UPDATE_START' },
			// By this time, `tab1` has finished fetching both thread 1 and thread 2,
			// and it has updated both `thread1state.refreshedAt` and `thread2state.refreshedAt`,
			// so `tab2` detects that there're no threads to update at the moment.
			{ tab: 2, event: 'UPDATE_NOT_REQUIRED' },
			{ tab: 2, event: 'UPDATE_END' },
			{ tab: 2, event: 'SCHEDULE_UPDATE' },

			{ tab: 1, event: 'FETCH_THREAD_END', channelId: channel.id, threadId: thread2.id },
			{ tab: 1, event: 'UPDATE_THREADS_END' },
			{ tab: 1, event: 'UPDATE_END' },
			{ tab: 1, event: 'SCHEDULE_UPDATE' }
		])

		subscribedThreadsUpdater1.stop()
		subscribedThreadsUpdater2.stop()
	})
})