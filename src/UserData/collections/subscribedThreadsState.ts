import type { UserDataCollection, SubscribedThreadState, SubscribedThreadStateEncoded } from '@/types'

import { encodeDate, decodeDate } from '../compression.js'

// A collection storing the "state" for "subscribed to" threads.
// State like "expired" status, "locked" status, new comments count, etc.
//
// Example: `subscribedThreadsState/a/123 = { ... }`.
//
export const subscribedThreadsState: UserDataCollection = {
	name: 'subscribedThreadsState',
	shortName: '🔍',

	type: 'channels-threads-data',

	methods: {
		getSubscribedThreadState: 'get',
		setSubscribedThreadState: 'set',
		removeSubscribedThreadState: 'remove'
	},

	schema: {
		commentsCount: {
			type: 'nonNegativeInteger',
			description: 'The count of comments in the thread'
		},
		newCommentsCount: {
			type: 'nonNegativeInteger',
			description: 'The count of new (unread) comments in the thread'
		},
		newRepliesCount: {
			type: 'nonNegativeInteger',
			description: 'The count of new (unread) comments in the thread which are also replies to the user\'s own comments'
		},
		latestComment: {
			description: 'The latest comment in the thread',
			schema: {
				id: {
					type: 'positiveInteger',
					description: 'The ID of the latest comment in the thread'
				},
				createdAt: {
					type: 'date',
					description: 'The date of the latest comment in the thread'
				}
			}
		},
		refreshedAt: {
			type: 'date',
			description: 'The date when the thread data was latest refreshed'
		},
		refreshErrorAt: {
			type: 'date',
			description: 'The date when the thread data couldn\'t be fetched due to an error. Gets reset on successfull fetch.',
			required: false
		},
		refreshErrorCount: {
			type: 'nonNegativeInteger',
			description: 'How many times in a row did the application attempt to fetch the thread and got an error in response. Gets reset on successfull fetch.',
			required: false
		}
	},

	decode(dataEncoded: SubscribedThreadStateEncoded) {
		// Added this assignment to fix TypeScript error.
		const data = dataEncoded as unknown as SubscribedThreadState

		// Decode `refreshErrorAt` property.
		if (data.refreshErrorAt) {
			data.refreshErrorAt = decodeDate(dataEncoded.refreshErrorAt)
		}
		// Decode `refreshedAt` property.
		data.refreshedAt = decodeDate(dataEncoded.refreshedAt)
		// Decode `latestComment.createdAt` property.
		data.latestComment.createdAt = decodeDate(dataEncoded.latestComment.createdAt)
		// Result.
		return data
	},

	encode(dataDecoded: SubscribedThreadState) {
		// Added this assignment to fix TypeScript error.
		const data = dataDecoded as unknown as SubscribedThreadStateEncoded

		// Encode `refreshErrorAt` property.
		if (data.refreshErrorAt) {
			data.refreshErrorAt = encodeDate(dataDecoded.refreshErrorAt)
		}
		// Encode `refreshedAt` property.
		data.refreshedAt = encodeDate(dataDecoded.refreshedAt)
		// Encode `latestComment.createdAt` property.
		data.latestComment.createdAt = encodeDate(dataDecoded.latestComment.createdAt)
		// Result.
		return data
	},

	// Updates to this collection are cached because it's frequently written to
	// as the user is scrolling a subscribed thread:
	// `<UnreadCommentWatcher/>` updates `subscribedThreadsState` for the currently
	// open subscribed thread every time a user scrolls down past an unread comment.
	//
	// To prevent frequent disk writes (potentially many writes per second),
	// updates aren't flushed to disk immediately.
	//
	cache: true,

	// The most "fresh" subscribed thread update data "wins" when merging.
	// `a` anb `b` are encoded.
	merge: (a: SubscribedThreadStateEncoded, b: SubscribedThreadStateEncoded) => {
		return a.latestComment.id > b.latestComment.id ? a : b
	},

	// When a thread expires, don't remove it from `subscribedThreadsStats` collection.
	// This way, `subscribedThreads` and `subscribedThreadsStats` collections would stay in sync.
	clearOnExpire: false
}