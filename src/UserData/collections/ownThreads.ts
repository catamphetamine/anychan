import type { UserDataCollection } from '@/types'

// Stores a list of IDs of the user's own threads in a channel.
//
// Example: `ownThreads/a = [123, 456]`.
//
export const ownThreads: UserDataCollection = {
	name: 'ownThreads',
	shortName: '🗣️',

	type: 'channels-threads',

	methods: {
		isOwnThread: ({ getFrom }) => (channelId, threadId) => {
			return getFrom(channelId, threadId) !== undefined
		},
		addOwnThread: 'addTo',
		removeOwnThread: 'removeFrom'
	}
}