import type { UserDataCollection } from '@/types'

// Stores a list of IDs of the user's own comments in a thread,
// including the "original comment" of the thread.
//
// The "own" flag for the "original comment" of the thread
// is also stored in `ownThreads` collection.
//
// Example: `ownComments/a/123 = [124, 125]`.
//
export const ownComments: UserDataCollection = {
	name: 'ownComments',
	shortName: '✍️',

	type: 'channels-threads-comments',

	methods: {
		isOwnComment: ({ getFrom }) => (channelId, threadId, commentId) => {
			return getFrom(channelId, threadId, commentId) !== undefined
		},
		addOwnComment: 'addTo',
		removeOwnComment: 'removeFrom'
	}
}