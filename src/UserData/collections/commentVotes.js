// Stores the user's votes on comments in a thread,
// including the "original comment" of the thread.
//
// The vote for the "original comment" of the thread
// is also stored in `threadVotes` collection.
// The rationale is that it's easier to get the votes
// for all threads in a channel using `threadVotes` collection
// rather than iterating over all matching `commentVotes` collection records.
//
// The data from this collection is used when rendering a comment
// to indicate whether the user "has already voted for this comment"
// and whether it was an upvote or a downvote.
//
// Example: `commentVotes/a/123: { '124': 1 }`.
//
export default {
	name: 'commentVotes',
	shortName: '⇧',

	type: 'channels-threads-comments-data',

	schema: {
		oneOf: [-1, 1],
		description: '1 for "upvote", -1 for "downvote"'
	},

	methods: {
		getCommentVote: 'getFrom',
		setCommentVote: 'setIn',
		removeCommentVote: 'removeFrom'
	},

	// There's no way to tell which one is the "latest" one.
	merge: (a, b) => b
}