// Stores a list of IDs of the hidden comments in a thread,
// including the "original comment" of the thread.
//
// The "hidden" status for the "original comment" of the thread
// is also stored in `hiddenThreads` collection.
//
// Users can hide certain comments in a thread.
// For example, if they're offensive.
//
// Example: `hiddenComments/a/123 = [125]`.
//
export default {
	name: 'hiddenComments',
	shortName: '🤫',

	type: 'channels-threads-comments',

	methods: {
		addHiddenComment: 'addTo',
		isCommentHidden: 'getFrom',
		removeHiddenComment: 'removeFrom'
	}
}