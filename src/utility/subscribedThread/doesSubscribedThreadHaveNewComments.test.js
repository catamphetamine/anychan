import doesSubscribedThreadHaveNewComments from './doesSubscribedThreadHaveNewComments.js'
import createSubscribedThreadStatsRecord from './createSubscribedThreadStatsRecord.js'
import UserData from '../../UserData/UserData.js'

import { MemoryStorage } from 'web-browser-storage'

function create() {
	const storage = new MemoryStorage()
	const userData = new UserData(storage)
	return { storage, userData }
}

describe('doesSubscribedThreadHaveNewComments', () => {
	it('should determine if a subscribed thread has new comments', () => {
		const { storage, userData } = create()

		const thread = {
			id: 100,
			channelId: 'a',
			title: 'Thread 1',
			comments: [{
				id: 100,
				content: 'Comment 1',
				createdAt: new Date(0)
			}, {
				id: 101,
				content: 'Comment 2',
				createdAt: new Date(0)
			}]
		}

		const subscribedThread = {
			id: 100,
			channel: { id: 'a' },
			title: 'Anime 1',
			addedAt: new Date(0)
		}

		userData.setLatestReadCommentId('a', 100, 100)

		userData.setSubscribedThreadStats('a', 100, createSubscribedThreadStatsRecord(thread, {
			refreshedAt: new Date(0),
			userData
		}))

		expectToEqual(
			doesSubscribedThreadHaveNewComments(subscribedThread, { userData }),
			true
		)

		userData.setLatestReadCommentId('a', 100, 101)

		userData.setSubscribedThreadStats('a', 100, createSubscribedThreadStatsRecord(thread, {
			refreshedAt: new Date(0),
			userData
		}))

		expectToEqual(
			doesSubscribedThreadHaveNewComments(subscribedThread, { userData }),
			false
		)
	})
})