import SubscribedThreadsUpdater from './SubscribedThreadsUpdater.js'
import addSubscribedThread from '../subscribedThread/addSubscribedThread.js'

import UserData from '../../UserData/UserData.js'
import UserSettings from '../../UserSettings/UserSettings.js'

import { MemoryStorage } from 'web-browser-storage'
import { TestTab } from 'web-browser-tab'
import { TestTimer } from 'web-browser-timer'

describe('SubscribedThreadsUpdater/tab', function() {
	it('should work for a single active tab (not the time to update yet)', async function() {
		const storage = new MemoryStorage()
		const userData = new UserData(storage)
		const userSettings = new UserSettings(storage)

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

		const dispatchedActions = []

		const dispatch = async (action) => {
			switch (action.type) {
				case 'SUBSCRIBED_THREADS: GET_SUBSCRIBED_THREADS':
					action.value = undefined
					break
			}

			dispatchedActions.push(action)

			if (action.type === 'GET_THREAD') {
				await timer.waitFor(10000)
				if (action.value.channelId === thread1.channelId && action.value.threadId === thread1.id) {
					return thread1
				} else {
					console.log(action)
					throw new Error('Thread not found')
				}
			}
		}

		const subscribedThreadsUpdater = new SubscribedThreadsUpdater({
			tab,
			timer,
			userData,
			userSettings,
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

		expect(subscribedThreadsUpdater.status).to.be.undefined

		subscribedThreadsUpdater.start()
		subscribedThreadsUpdater.status.should.equal('SCHEDULED')

		await timer.fastForward(15000)

		subscribedThreadsUpdater.status.should.equal('SCHEDULED')

		dispatchedActions.should.deep.equal([{
			type: 'SUBSCRIBED_THREADS: UPDATE_NOT_IN_PROGRESS',
			value: undefined
		}])

		subscribedThreadsUpdater.stop()
	})
})