import onThreadsFetched from './onThreadsFetched.js'
import addSubscribedThread from '../subscribedThread/addSubscribedThread.js'
import getDateWithoutMilliseconds from '../getDateWithoutMilliseconds.js'
import UserData from '../../UserData/UserData.js'

import { MemoryStorage } from 'web-browser-storage'
import { TestTimer } from 'web-browser-timer'

describe('onThreadsFetched', function() {
	it('should update subscribed threads when fetching a list of threads in a channel', async function() {
		const storage = new MemoryStorage()
		const userData = new UserData(storage)

		let dispatchedActions = []

		const dispatch = (action) => {
			switch (action.type) {
				case 'SUBSCRIBED_THREADS: GET_SUBSCRIBED_THREADS':
					action.value = undefined
					break
			}
			dispatchedActions.push(action)
		}

		const timer = new TestTimer({
			log: (...args) => console.log('timer:', ...args)
		})

		await timer.fastForward(Date.now())

		const now = new Date(timer.now())
		const nowWithoutMilliseconds = getDateWithoutMilliseconds(now)

		const channel = {
			id: 'a',
			title: 'Anime'
		}

		const thread = {
			id: 123,
			channelId: 'a',
			title: 'Anime 1',
			createdAt: now,
			comments: [{
				id: 123,
				content: 'Comment 1',
				createdAt: now
			}]
		}

		const subscribedThreadsUpdater = {
			wasReset: false,
			reset() {
				this.wasReset = true
			}
		}

		addSubscribedThread({
			thread,
			dispatch,
			userData,
			timer,
			subscribedThreadsUpdater
		})

		// `addSubscribedThread()` caused a refresh of the list of subscribed threads.
		dispatchedActions.should.deep.equal([{
			type: 'SUBSCRIBED_THREADS: GET_SUBSCRIBED_THREADS',
			value: undefined
		}])

		dispatchedActions = []

		expect(userData.getThreadAccessedAt(thread.channelId, thread.id)).to.equal(undefined)

		userData.getSubscribedThread('a', 123).id.should.equal(123)

		userData.getSubscribedThreadState('a', 123).should.deep.equal({
			latestComment: {
				id: 123,
				createdAt: nowWithoutMilliseconds
			},
			commentsCount: 1,
			newCommentsCount: 1,
			newRepliesCount: 0,
			refreshedAt: nowWithoutMilliseconds
		})

		userData.setThreads('a', [123])
		userData.getThreads('a').should.deep.equal([123])

		thread.locked = true

		const thread2 = {
			id: 456,
			channelId: 'a',
			title: 'Anime 2',
			createdAt: now,
			comments: [{
				id: 456,
				content: 'Comment 2.1',
				createdAt: now
			}]
		}

		onThreadsFetched('a', [thread, thread2], {
			dispatch,
			userData,
			timer
		})

		// None of the individual threads have been accessed specifically.
		expect(
			userData.getThreadAccessedAt(thread.channelId, thread.id)
		).to.equal(undefined)

		userData.getThreads('a').should.deep.equal([123, 456])

		userData.getSubscribedThread('a', 123).should.deep.equal({
			id: 123,
			channel: {
				id: 'a',
				// title: 'Anime'
			},
			title: 'Anime 1',
			locked: true,
			addedAt: nowWithoutMilliseconds,
			updatedAt: nowWithoutMilliseconds
		})

		userData.getSubscribedThreadState('a', 123).should.deep.equal({
			latestComment: {
				id: 123,
				createdAt: nowWithoutMilliseconds
			},
			commentsCount: 1,
			newCommentsCount: 1,
			newRepliesCount: 0,
			refreshedAt: nowWithoutMilliseconds
		})

		dispatchedActions.should.deep.equal([{
			type: 'SUBSCRIBED_THREADS: GET_SUBSCRIBED_THREADS',
			value: undefined
		}])
	})

	it('shouldn\'t mark a subscribed thread as `archived` when it\'s not present in a list of threads in a channel', async function() {
		const storage = new MemoryStorage()
		const userData = new UserData(storage)

		let dispatchedActions = []

		const dispatch = (action) => {
			switch (action.type) {
				case 'SUBSCRIBED_THREADS: GET_SUBSCRIBED_THREADS':
					action.value = undefined
					break
			}
			dispatchedActions.push(action)
		}

		const timer = new TestTimer({
			log: (...args) => console.log('timer:', ...args)
		})

		await timer.fastForward(Date.now())

		const now = getDateWithoutMilliseconds(new Date(timer.now()))

		const thread = {
			id: 123,
			channelId: 'a',
			title: 'Anime 1',
			createdAt: now,
			comments: [{
				id: 123,
				content: 'Comment 1',
				createdAt: now
			}]
		}

		const subscribedThreadsUpdater = {
			wasReset: false,
			reset() {
				this.wasReset = true
			}
		}

		addSubscribedThread({
			thread,
			dispatch,
			userData,
			timer,
			subscribedThreadsUpdater
		})

		// `addSubscribedThread()` caused a refresh of the list of subscribed threads.
		dispatchedActions.should.deep.equal([{
			type: 'SUBSCRIBED_THREADS: GET_SUBSCRIBED_THREADS',
			value: undefined
		}])

		dispatchedActions = []

		expect(userData.getThreadAccessedAt(thread.channelId, thread.id)).to.equal(undefined)

		userData.getSubscribedThread('a', 123).id.should.equal(123)

		userData.getSubscribedThreadState('a', 123).should.deep.equal({
			latestComment: {
				id: 123,
				createdAt: now
			},
			commentsCount: 1,
			newCommentsCount: 1,
			newRepliesCount: 0,
			refreshedAt: now
		})

		userData.setThreads('a', [123])
		userData.getThreads('a').should.deep.equal([123])

		const thread2 = {
			id: 456,
			channelId: 'a',
			title: 'Anime 2',
			createdAt: now,
			comments: [{
				id: 456,
				content: 'Comment 2.1',
				createdAt: now
			}]
		}

		onThreadsFetched('a', [thread2], {
			dispatch,
			userData,
			timer
		})

		// None of the individual threads have been accessed specifically.
		expect(
			userData.getThreadAccessedAt(thread.channelId, thread.id)
		).to.equal(undefined)

		userData.getThreads('a').should.deep.equal([456])

		userData.getSubscribedThread('a', 123).should.deep.equal({
			id: 123,
			channel: {
				id: 'a',
				// title: 'Anime'
			},
			title: 'Anime 1',
			// locked: true,
			// archived: true,
			addedAt: now,
			// updatedAt: now
		})

		userData.getSubscribedThreadState('a', 123).should.deep.equal({
			latestComment: {
				id: 123,
				createdAt: now
			},
			commentsCount: 1,
			newCommentsCount: 1,
			newRepliesCount: 0,
			refreshedAt: now
		})

		dispatchedActions.should.deep.equal([])

		// dispatchedActions.should.deep.equal([{
		// 	type: 'SUBSCRIBED_THREADS: GET_SUBSCRIBED_THREADS',
		// 	value: undefined
		// }])
	})
})