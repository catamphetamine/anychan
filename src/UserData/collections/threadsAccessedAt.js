import { encodeDate, decodeDate } from '../compression.js'

// Stores "latest accessed at" timestamps for threads.
// Archived threads that haven't been accessed for a while
// get cleaned up from User Data (including this collection).
//
// Some providers have a concept of "archived" threads.
// "Archived" threads are usually old/locked/expired ones
// that may or may not be scheduled for deletion.
//
// Deleted threads are called "expired" threads.
//
// For example, some imageboards keep threads, that've been
// pushed off by newer ones, for some time (for example, a couple of days).
// When such thread is detected to have been pushed off,
// it's marked as "archived" with the current timestamp
// as its "archived at" date.
// The precise "archived at" date can usually be known
// when fetching a "get thread comments" API response
// if a user navigates to such thread's page.
//
// The automatic clean-up is set up to clear threads
// that've been archived (or deleted) for a long time.
// During such clean-up, all references to such thread
// in other collections are deleted too, excluding the cases
// when a collection is defined with `clearOnExpire: false`.
//
// The timestamp is in days rather than seconds.
// (just to save on storage space)
//
// Example: `threadsAccessedAt/a/123 = 12345`.
//
export default {
	name: 'threadsAccessedAt',
	shortName: '📂',

	type: 'channels-threads-data',

	schema: {
		type: 'date',
		description: 'The latest time the thread was "accessed" by the user. Is used to determine "stale" archived thread data for removal during clean-up.'
	},

	methods: {
		getThreadAccessedAt: 'get',
		setThreadAccessedAt: 'set',
		removeThreadAccessedAt: 'remove'
	},

	decode(data) {
		return decodeDate(data, { granularity: 'days' })
	},

	encode(data) {
		return encodeDate(data, { granularity: 'days' })
	},

	// `a` and `b` are encoded.
	// Later `accessedAt` date "wins".
	merge: (a, b) => a > b ? a : b
}