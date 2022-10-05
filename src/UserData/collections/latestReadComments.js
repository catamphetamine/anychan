// Stores the ID of the latest "read" comment in a thread.
// (including the "original comment" of the thread)
//
// If a comment has been fully shown on the screen,
// it's marked as "read", so that next time the user
// opens this thread, it would show only the comments
// starting from the first non-"read" one.
// This way, the user doesn't have to scroll to the bottom
// every time they open a thread to read new comments.
//
// Example: `latestReadComments/a/123 = 125`.
//
export default {
	name: 'latestReadComments',
	shortName: '👀',

	type: 'channels-threads-data',

	schema: {
		type: 'positiveInteger',
		description: 'Comment ID'
	},

	methods: {
		getLatestReadCommentId: 'get',
		setLatestReadCommentId: 'set',
		removeLatestReadCommentId: 'remove'
	},

	// Cache writes to this collection because it's frequently written
	// as the user is scrolling a thread.
	// Changes aren't flushed to disk immediately to prevent frequent disk writes.
	// (potentially many writes per second).
	cache: true,

	// The most recent "read" comment "wins" when merging.
	// `a` anb `b` are encoded.
	// merge: (a, b) => a.id > b.id ? a : b
	merge: (a, b) => a > b ? a : b
}