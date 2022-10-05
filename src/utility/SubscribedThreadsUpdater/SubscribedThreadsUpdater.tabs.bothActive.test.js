import SubscribedThreadsUpdater from './SubscribedThreadsUpdater.js'
import addSubscribedThread from '../subscribedThread/addSubscribedThread.js'
import UserData from '../../UserData/UserData.js'

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

		const timer = new TestTimer()

		const tab1 = new TestTab({
			id: '1 (inactive)',
			storage: storage1,
			timer
		})

		const tab2 = new TestTab({
			id: '2 (active)',
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

		let dispatchedActions1 = []
		let dispatchedActions2 = []

		const dispatch = async (action, tab) => {
			switch (action.type) {
				case 'SUBSCRIBED_THREADS: GET_SUBSCRIBED_THREADS':
					action.value = undefined
					break
			}

			const dispatchedActions = tab === tab1 ? dispatchedActions1 : dispatchedActions2
			dispatchedActions.push(action)

			if (action.type === 'GET_THREAD') {
				await timer.waitFor(10000)
				if (action.value.channelId === thread1.channelId && action.value.threadId === thread1.id) {
					return thread1
				} else if (action.value.channelId === thread2.channelId && action.value.threadId === thread2.id) {
					return thread2
				} else {
					console.log(action)
					throw new Error('Thread not found')
				}
			}
		}

		const dispatch1 = async (action) => await dispatch(action, tab1)
		const dispatch2 = async (action) => await dispatch(action, tab2)

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
			storage: storage1,
			dispatch: dispatch1,
			timer,
			nextUpdateRandomizeInterval: 0,
			createGetThreadAction: (channelId, threadId) => {
				return {
					type: 'GET_THREAD',
					value: {
						channelId,
						threadId
					}
				}
			}
		})

		const subscribedThreadsUpdater2 = new SubscribedThreadsUpdater({
			tab: tab2,
			userData: userData2,
			storage: storage2,
			dispatch: dispatch2,
			timer,
			nextUpdateRandomizeInterval: 0,
			createGetThreadAction: (channelId, threadId) => {
				return {
					type: 'GET_THREAD',
					value: {
						channelId,
						threadId
					}
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

		tab1.setActive(true)
		tab2.setActive(true)

		// "Schedule an upate after 1 second".
		await timer.fastForward(2000)

		subscribedThreadsUpdater1.status.should.equal('UPDATE')

		// "Wait and retry. Reason: CONCURRENT_UPDATE_IN_PROGRESS".
		subscribedThreadsUpdater2.status.should.equal('SCHEDULED')

		dispatchedActions1.should.deep.equal([
			{
				type: 'SUBSCRIBED_THREADS: UPDATE_IN_PROGRESS_FOR_THREAD',
				value: {
					channelId: channel.id,
					threadId: thread1.id
				}
			},
			{
				type: 'GET_THREAD',
				value: {
					channelId: channel.id,
					threadId: thread1.id
				}
			}
		])

		// Tab 2 is still waiting for `STATUS_RECORD_CREATION_REPEATABLE_READ_CHECK_INTERVAL`
		// at this point.
		dispatchedActions2.should.deep.equal([
			{
				type: 'SUBSCRIBED_THREADS: UPDATE_IN_PROGRESS_FOR_THREAD',
				value: {
					channelId: undefined,
					threadId: undefined
				}
			},
			{
				type: 'SUBSCRIBED_THREADS: UPDATE_IN_PROGRESS_FOR_THREAD',
				value: {
					channelId: undefined,
					threadId: undefined
				}
			},
			{
				type: 'SUBSCRIBED_THREADS: UPDATE_IN_PROGRESS_FOR_THREAD',
				value: {
					channelId: undefined,
					threadId: undefined
				}
			},
			// Tab 2 emits `UPDATE_IN_PROGRESS_FOR_THREAD` action
			// when it detects an external change to the local storage
			// that was made by Tab 1.
			{
				type: 'SUBSCRIBED_THREADS: UPDATE_IN_PROGRESS_FOR_THREAD',
				value: {
					channelId: channel.id,
					threadId: thread1.id
				}
			}
		])

		dispatchedActions1 = []
		dispatchedActions2 = []

		subscribedThreadsUpdater1.stop()
		subscribedThreadsUpdater2.stop()
	})
})