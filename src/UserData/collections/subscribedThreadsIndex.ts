import type { UserDataCollection } from '@/types'

// An index of "subscribed to" threads.
//
// Users can "subscribed" to threads.
// "Subscribed to" threads are shown as a list in sidebar,
// and they also get refreshed for new comments periodically.
//
// This is just an "index" that tells whether a thread is "subscribed to" or not.
// The actual subscribed thread data is stored in another collection called
// "subscribedThreads".
//
// Example: `subscribedThreadsIndex/a = [123, 125]`.
//
export const subscribedThreadsIndex: UserDataCollection = {
	name: 'subscribedThreadsIndex',
	shortName: '🔖',

	type: 'channels-threads',

	methods: {
		getSubscribedThreadIdsForChannel: 'get',
		addSubscribedThreadIdForChannel: 'addTo',
		removeSubscribedThreadIdFromChannel: 'removeFrom'
	},

	// When a thread expires, don't remove it from `subscribedThreadsIndex` collection.
	// This way, `subscribedThreads` and `subscribedThreadsIndex` collections would stay in sync.
	clearOnExpire: false
}