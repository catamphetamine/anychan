import doesSubscribedThreadHaveNewComments from './doesSubscribedThreadHaveNewComments.js'
import createSubscribedThreadStateRecord from './createSubscribedThreadStateRecord.js'
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

		const comment1 = {
			id: 100,
			content: 'Comment 1',
			createdAt: new Date(0)
		}

		const comment2 = {
			id: 101,
			content: 'Comment 2',
			createdAt: new Date(0)
		}

		const thread = {
			id: 100,
			channelId: 'a',
			title: 'Thread 1',
			comments: [comment1, comment2]
		}

		const subscribedThread = {
			id: 100,
			channel: { id: 'a' },
			title: 'Anime 1',
			addedAt: new Date(0)
		}

		userData.setLatestReadCommentId('a', 100, 100)

		userData.setSubscribedThreadState('a', 100, createSubscribedThreadStateRecord(thread, {
			refreshedAt: new Date(0),
			userData
		}))

		expectToEqual(
			doesSubscribedThreadHaveNewComments(subscribedThread, { userData }),
			true
		)

		expectToEqual(
			doesSubscribedThreadHaveNewComments(subscribedThread, { type: 'reply', userData }),
			false
		)

		// comment1.replies = [comment2]
		comment2.inReplyTo = [comment1]

		userData.addOwnComment('a', 100, comment1.id)

		userData.setSubscribedThreadState('a', 100, createSubscribedThreadStateRecord(thread, {
			refreshedAt: new Date(0),
			userData
		}))

		expectToEqual(
			doesSubscribedThreadHaveNewComments(subscribedThread, { type: 'reply', userData }),
			true
		)

		userData.setLatestReadCommentId('a', 100, 101)

		userData.setSubscribedThreadState('a', 100, createSubscribedThreadStateRecord(thread, {
			refreshedAt: new Date(0),
			userData
		}))

		expectToEqual(
			doesSubscribedThreadHaveNewComments(subscribedThread, { userData }),
			false
		)

		expectToEqual(
			doesSubscribedThreadHaveNewComments(subscribedThread, { type: 'reply', userData }),
			false
		)
	})
})