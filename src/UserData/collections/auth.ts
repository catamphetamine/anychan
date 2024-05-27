import type { UserDataCollection } from '@/types'

// User's authentication data. For example, access token is stored here.
export const auth: UserDataCollection = {
	name: 'auth',
	shortName: '🔑',

	type: 'value',

	schema: {
		accessToken: {
			type: 'string',
			description: 'Access token ("authentication cookie")',
			example: 'abcdef1234567890'
		}
	},

	// `a` and `b` are encoded.
	merge: (a, b) => b
}