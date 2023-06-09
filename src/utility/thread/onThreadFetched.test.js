import onThreadFetched from './onThreadFetched.js'
import addSubscribedThread from '../subscribedThread/addSubscribedThread.js'
import getDateWithoutMilliseconds from '../getDateWithoutMilliseconds.js'
import roundTimestamp from '../roundTimestamp.js'
import UserData from '../../UserData/UserData.js'

import { MemoryStorage } from 'web-browser-storage'
import { TestTimer } from 'web-browser-timer'

describe('onThreadFetched', function() {
	it('should fetch a thread', async function() {
		const storage = new MemoryStorage()
		const userData = new UserData(storage)

		const timer = new TestTimer()
		await timer.fastForward(Date.now())

		const now = new Date(timer.now())
		const nowWithoutMilliseconds = getDateWithoutMilliseconds(now)
		const nowRoundDays = new Date(roundTimestamp(now.getTime(), { granularity: 'days' }))

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

		addSubscribedThread(thread, { channel, userData, timer, subscribedThreadsUpdater })

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

		expect(userData.getThreadAccessedAt(thread.channelId, thread.id)).to.equal(undefined)

		const dispatchedActions = []
		const dispatch = (action) => {
			switch (action.type) {
				case 'SUBSCRIBED_THREADS: GET_SUBSCRIBED_THREADS':
					action.value = undefined
					break
			}
			dispatchedActions.push(action)
		}

		thread.locked = true

		thread.comments.push({
			id: 124,
			createdAt: now,
			content: 'Comment 2.1'
		})

		onThreadFetched(thread, {
			dispatch,
			userData,
			timer
		})

		expect(
			userData.getThreadAccessedAt(thread.channelId, thread.id).getTime()
		).to.equal(nowRoundDays.getTime())

		userData.getSubscribedThread('a', 123).should.deep.equal({
			id: 123,
			channel: {
				id: 'a',
				title: 'Anime'
			},
			title: 'Anime 1',
			locked: true,
			// lockedAt: nowWithoutMilliseconds,
			addedAt: nowWithoutMilliseconds,
			updatedAt: nowWithoutMilliseconds
		})

		userData.getSubscribedThreadState('a', 123).should.deep.equal({
			latestComment: {
				id: 124,
				createdAt: nowWithoutMilliseconds
			},
			commentsCount: 2,
			newCommentsCount: 2,
			newRepliesCount: 0,
			refreshedAt: nowWithoutMilliseconds
		})

		dispatchedActions.should.deep.equal([{
			type: 'SUBSCRIBED_THREADS: GET_SUBSCRIBED_THREADS',
			value: undefined
		}])
	})
})