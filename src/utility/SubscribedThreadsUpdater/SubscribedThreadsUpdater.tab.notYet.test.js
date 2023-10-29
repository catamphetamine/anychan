import SubscribedThreadsUpdater from './SubscribedThreadsUpdater.js'
import addSubscribedThread from '../subscribedThread/addSubscribedThread.js'

import UserData from '../../UserData/UserData.js'
import UserSettings from '../../utility/settings/UserSettings.js'
import DATA_SOURCES from '../../dataSources.js'

import { MemoryStorage } from 'web-browser-storage'
import { TestTab } from 'web-browser-tab'
import { TestTimer } from 'web-browser-timer'

describe('SubscribedThreadsUpdater/tab', function() {
	it('should work for a single active tab (not the time to update yet)', async function() {
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

		addSubscribedThread(thread1, {
			channel,
			userData,
			timer,
			subscribedThreadsUpdater: subscribedThreadsUpdaterStub
		})

		// 3 seconds passed.
		// Not the time to update subscribed threads yet.
		await timer.fastForward(3 * 1000)

		const startedAt = new Date(timer.now())

		thread1.comments.push({
			id: 2,
			content: 'Comment 2',
			createdAt: startedAt
		})

		subscribedThreadsUpdaterStub.wasReset.should.equal(true)

		let eventLog = []

		let dispatchedActions = []

		const dispatch = (action) => {
			switch (action.type) {
				case 'SUBSCRIBED_THREADS: GET_SUBSCRIBED_THREADS':
					action.value = undefined
					break
			}
			dispatchedActions.push(action)
		}

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
		subscribedThreadsUpdater.status.should.equal('SCHEDULED')

		await timer.fastForward(15000)

		subscribedThreadsUpdater.status.should.equal('SCHEDULED')

		eventLog.should.deep.equal([
			{ event: 'START' },

			{ event: 'CHECK_IS_ACTIVE_TAB' },
			{ event: 'IS_ACTIVE_TAB' },

			{ event: 'UPDATE_START' },

			{ event: 'UPDATE_NOT_REQUIRED' },

			{ event: 'UPDATE_END' },

			{ event: 'SCHEDULE_UPDATE' }
		])

		// dispatchedActions.should.deep.equal([{
		// 	type: 'SUBSCRIBED_THREADS: UPDATE_NOT_IN_PROGRESS',
		// 	value: undefined
		// }])

		subscribedThreadsUpdater.stop()
	})
})