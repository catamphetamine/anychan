import addSubscribedThread from './addSubscribedThread.js'
import getDateWithoutMilliseconds from '../getDateWithoutMilliseconds.js'
import UserData from '../../UserData/UserData.js'

import { MemoryStorage } from 'web-browser-storage'
import { TestTimer } from 'web-browser-timer'

describe('addSubscribedThread', function() {
	it('should add a subscribed thread', async function() {
		const storage = new MemoryStorage()
		const userData = new UserData(storage)

		const timer = new TestTimer()

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
			title: 'Thread 1',
			createdAt: now,
			locked: true,
			comments: [{
				id: 123,
				content: 'Comment 1',
				createdAt: now
			}]
		}

		thread.comments.push({
			id: 124,
			content: 'Comment 2',
			createdAt: now,
			inReplyTo: [thread.comments[0]]
		})

		const subscribedThreadsUpdater = {
			wasReset: false,
			reset() {
				this.wasReset = true
			}
		}

		userData.setLatestReadCommentId('a', 123, 123)

		userData.addOwnThread('a', 123)
		userData.addOwnComment('a', 123, 123)

		addSubscribedThread(thread, { channel, userData, timer, subscribedThreadsUpdater })

		userData.getSubscribedThreadIdsForChannel(channel.id).should.deep.equal([thread.id])

		userData.getSubscribedThread('a', 123).should.deep.equal({
			id: 123,
			channel: {
				id: 'a',
				title: 'Anime'
			},
			title: 'Thread 1',
			addedAt: nowWithoutMilliseconds,
			locked: true
		})

		userData.getSubscribedThreadStats('a', 123).should.deep.equal({
			latestComment: {
				id: 124,
				createdAt: nowWithoutMilliseconds
			},
			commentsCount: 2,
			newCommentsCount: 1,
			newRepliesCount: 1,
			refreshedAt: nowWithoutMilliseconds
		})

		subscribedThreadsUpdater.wasReset.should.equal(true)
	})
})