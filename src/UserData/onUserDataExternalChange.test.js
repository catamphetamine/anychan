import addUserDataExternalChangeListener from './addUserDataExternalChangeListener.js'
import addSubscribedThread from '../utility/subscribedThread/addSubscribedThread.js'

import UserData from './UserData.js'
import { MemoryStorage } from 'web-browser-storage'
import { TestTimer } from 'web-browser-timer'

describe('UserData/onUserDataExternalChange', function() {
	it('should respond to external changes in User Data (on favorite channels change)', function() {
		const baseStorage = new MemoryStorage()

		const storage1 = baseStorage.createSharedInstance('1')
		const storage2 = baseStorage.createSharedInstance('2')

		const userData1 = new UserData(storage1)
		const userData2 = new UserData(storage2)

		let dispatchedActions = []

		addUserDataExternalChangeListener({
			dispatch: (action) => {
				switch (action.type) {
					case 'FAVORITE_CHANNELS: GET_FAVORITE_CHANNELS':
						action.value = undefined
						break
				}
				dispatchedActions.push(action)
			},
			userData: userData1
		})

		userData1.addFavoriteChannel({
			id: 'a',
			title: 'Anime'
		})

		dispatchedActions.should.deep.equal([])

		userData2.addFavoriteChannel({
			id: 'b',
			title: 'Random'
		})

		dispatchedActions.should.deep.equal([
			{
				type: 'FAVORITE_CHANNELS: GET_FAVORITE_CHANNELS',
				value: undefined
			}
		])

		userData1.getFavoriteChannels().should.deep.equal([
			{
				id: 'a',
				title: 'Anime'
			},
			{
				id: 'b',
				title: 'Random'
			}
		])
	})

	it('should respond to external changes in User Data (on subscribed threads change)', function() {
		const baseStorage = new MemoryStorage()

		const storage1 = baseStorage.createSharedInstance('1')
		const storage2 = baseStorage.createSharedInstance('2')

		const userData1 = new UserData(storage1)
		const userData2 = new UserData(storage2)

		let dispatchedActions = []

		addUserDataExternalChangeListener({
			dispatch: (action) => {
				switch (action.type) {
					case 'SUBSCRIBED_THREADS: GET_SUBSCRIBED_THREADS':
						action.value = undefined
						break
				}
				dispatchedActions.push(action)
			},
			userData: userData1
		})

		const timer = new TestTimer()

		const date = new Date(timer.now())

		const subscribedThreadsUpdater = {
			wasReset: false,
			reset() {
				this.wasReset = true
			}
		}

		const channel = {
			id: 'a',
			title: 'Anime'
		}

		const thread1 = {
			id: 1,
			channelId: channel.id,
			title: 'Thread 1',
			createdAt: date,
			commentsCount: 1,
			attachmentsCount: 0,
			comments: [{
				id: 1,
				content: 'Comment 1',
				createdAt: date
			}]
		}

		const thread2 = {
			id: 2,
			channelId: channel.id,
			title: 'Thread 2',
			createdAt: date,
			commentsCount: 1,
			attachmentsCount: 0,
			comments: [{
				id: 1,
				content: 'Comment 1',
				createdAt: date
			}]
		}

		addSubscribedThread(thread1, {
			channel,
			userData: userData1,
			subscribedThreadsUpdater,
			timer
		})

		dispatchedActions.should.deep.equal([])

		userData1.getSubscribedThreadIdsForChannel(channel.id).should.deep.equal([
			thread1.id
		])

		addSubscribedThread(thread2, {
			channel,
			userData: userData2,
			subscribedThreadsUpdater,
			timer
		})

		dispatchedActions.should.deep.equal([
			// `subscribedThreads` collection got updated in `userData2`:
			// a new `subscribedThread` entry was added.
			{
				type: 'SUBSCRIBED_THREADS: GET_SUBSCRIBED_THREADS',
				value: undefined
			},
			// `subscribedThreadsIndex` collection got updated in `userData2`:
			// a new `threadId` was added for the channel.
			{
				type: 'SUBSCRIBED_THREADS: GET_SUBSCRIBED_THREADS',
				value: undefined
			},
			// `subscribedThreadsStats` collection got updated in `userData2`:
			// a new `subscribedThreadsStats` entry was added.
			{
				type: 'SUBSCRIBED_THREADS: GET_SUBSCRIBED_THREADS',
				value: undefined
			},
			// `subscribedThreads` collection got updated in `userData2`:
			// subscribed threads have been sorted after adding a new subscribed thread.
			{
				type: 'SUBSCRIBED_THREADS: GET_SUBSCRIBED_THREADS',
				value: undefined
			}
		])

		userData1.getSubscribedThreadIdsForChannel(channel.id).should.deep.equal([
			thread1.id,
			thread2.id
		])
	})

	it('should respond to external changes in User Data (on comment read)', function() {
		const baseStorage = new MemoryStorage()

		const storage1 = baseStorage.createSharedInstance('1')
		const storage2 = baseStorage.createSharedInstance('2')

		const userData1 = new UserData(storage1)
		const userData2 = new UserData(storage2)

		let dispatchedActions = []

		addUserDataExternalChangeListener({
			dispatch: (action) => {
				dispatchedActions.push(action)
			},
			userData: userData1
		})

		userData1.setLatestReadCommentId('a', 123, 123)

		dispatchedActions.should.deep.equal([])

		userData2.setLatestReadCommentId('a', 123, 124)

		dispatchedActions.should.deep.equal([
			{
				type: 'DATA: ON_COMMENT_READ',
				value: {
					channelId: 'a',
					threadId: 123,
					commentId: 124,
					commentIndex: undefined
				}
			}
		])

		userData1.getLatestReadCommentId('a', 123).should.equal(124)
	})

	it('should respond to external changes in User Data (on announcement changed)', function() {
		const baseStorage = new MemoryStorage()

		const storage1 = baseStorage.createSharedInstance('1')
		const storage2 = baseStorage.createSharedInstance('2')

		const userData1 = new UserData(storage1)
		const userData2 = new UserData(storage2)

		let dispatchedActions = []

		addUserDataExternalChangeListener({
			dispatch: (action) => {
				dispatchedActions.push(action)
			},
			userData: userData1
		})

		userData1.setAnnouncement({
			date: '2012-12-21T00:00:00.000Z',
			content: 'Test'
		})

		dispatchedActions.should.deep.equal([])

		userData2.setAnnouncement({
			date: '2012-12-22T00:00:00.000Z',
			content: 'Test 2'
		})

		dispatchedActions.should.deep.equal([
			{
				type: 'ANNOUNCEMENT: SET_ANNOUNCEMENT',
				value: {
					date: '2012-12-22T00:00:00.000Z',
					content: 'Test 2'
				}
			}
		])

		userData1.getAnnouncement().should.deep.equal({
			date: '2012-12-22T00:00:00.000Z',
			content: 'Test 2'
		})
	})
})