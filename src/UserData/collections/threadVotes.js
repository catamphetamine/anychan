// Stores all of the user's votes on threads in a channel.
//
// The data from this collection is used when rendering a comment
// to indicate whether the user "has already voted for this thread"
// and whether it was an upvote or a downvote.
//
// Example: `threadVotes/a: { 123: 1 }`.
//
export default {
	name: 'threadVotes',
	shortName: '⇮',

	type: 'channels-thread-data',

	schema: {
		oneOf: [-1, 1],
		description: '1 for "upvote", -1 for "downvote"'
	},

	methods: {
		getThreadVote: 'getFrom',
		setThreadVote: 'setIn',
		removeThreadVote: 'removeFrom'
	},

	// There's no way to tell which one is the "latest" one.
	merge: (a, b) => b
}