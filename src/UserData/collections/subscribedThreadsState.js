import { encodeDate, decodeDate } from '../compression.js'

// A collection storing the "state" for "subscribed to" threads.
// State like "expired" status, "locked" status, new comments count, etc.
//
// Example: `subscribedThreadsState/a/123 = { ... }`.
//
export default {
	name: 'subscribedThreadsState',
	shortName: '🔍',

	type: 'channels-threads-data',

	methods: {
		getSubscribedThreadStats: 'get',
		setSubscribedThreadStats: 'set',
		removeSubscribedThreadStats: 'remove'
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
		}
	},

	decode(data) {
		// Decode `refreshedAt` property.
		data.refreshedAt = decodeDate(data.refreshedAt)
		// Decode `latestComment.createdAt` property.
		data.latestComment.createdAt = decodeDate(data.latestComment.createdAt)
		// Result.
		return data
	},

	encode(data) {
		// Encode `refreshedAt` property.
		data.refreshedAt = encodeDate(data.refreshedAt)
		// Encode `latestComment.createdAt` property.
		data.latestComment.createdAt = encodeDate(data.latestComment.createdAt)
		// Result.
		return data
	},

	// Cache writes to this collection because it's frequently written
	// as the user is scrolling a thread.
	// Changes aren't flushed to disk immediately to prevent frequent disk writes.
	// (potentially many writes per second).
	cache: true,

	// The most "fresh" subscribed thread update data "wins" when merging.
	// `a` anb `b` are encoded.
	merge: (a, b) => a.latestComment.id > b.latestComment.id ? a : b,

	// When a thread expires, don't remove it from `subscribedThreadsStats` collection.
	// This way, `subscribedThreads` and `subscribedThreadsStats` collections would stay in sync.
	clearOnExpire: false
}