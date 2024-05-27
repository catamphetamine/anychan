import type { UserDataCollection } from '@/types'

// The latest date when the latest announcement has been fetched from the server.
// (in milliseconds).
//
// Example: `announcementRefreshedAt = 1234567890`.
//
export const announcementRefreshedAt: UserDataCollection = {
	name: 'announcementRefreshedAt',
	shortName: null,

	type: 'value',

	schema: {
		type: 'number',
		description: 'The timestamp of the latest date when the latest announcement has been fetched from the server'
	},

	// Later announcement refresh date overwrites an earlier one.
	merge: (a, b) => a > b ? a : b
}