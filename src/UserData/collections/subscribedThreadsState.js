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
	merge: (a, b) => a.latestComment.id > b.latestComment.id ? a : b,

	// When a thread expires, don't remove it from `subscribedThreadsStats` collection.
	// This way, `subscribedThreads` and `subscribedThreadsStats` collections would stay in sync.
	clearOnExpire: false
}