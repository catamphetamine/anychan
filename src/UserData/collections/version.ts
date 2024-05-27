import type { UserDataCollection } from '@/types'

// User Data version.
export const version: UserDataCollection = {
	name: 'version',
	shortName: null,

	type: 'value',

	schema: {
		type: 'positiveInteger',
		description: 'User Data Version'
	},

	merge: (a, b) => a > b ? a : b
}
