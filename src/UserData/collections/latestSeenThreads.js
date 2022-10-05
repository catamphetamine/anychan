// The ID of the latest thread the user has "seen" in a channel.
//
// If a user has seen the opening post of a thread
// on a channel page then such thread is marked as "seen".
// It's called "seen", not "read", because the user didn't
// necessarily read the whole thread; they might even not
// clicked on it in order to go to the thread's page, but they've "seen" it.
// On a channel page, there's a switch: "Show all" / "Show new".
// Choosing "Show new" only shows the threads newer than the latest "seen" one.
//
// Example: `latestSeenThreads/a = 123`.
//
export default {
	name: 'latestSeenThreads',
	shortName: '👁',

	type: 'channels-data',

	schema: {
		type: 'positiveInteger',
		description: 'Latest seen thread ID'
	},

	methods: {
		getLatestSeenThreadId: 'get',
		setLatestSeenThreadId: 'set'
	},

	// Cache the changes to this collection
	// and don't flush them to disk immediately
	// to prevent several disk writes per second.
	// Chrome seems to cache writes to `localStorage` anyway.
	cache: true,

	// The most recent thread ID "wins" when merging.
	// `a` anb `b` are encoded.
	merge: (a, b) => a > b ? a : b
}