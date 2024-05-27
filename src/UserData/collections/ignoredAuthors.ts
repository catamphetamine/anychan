import type { UserDataCollection } from '@/types'

// Stores the "fingerprint" IDs of the authors this user has chosen to "ignore".
//
// Users can "ignore" all comments left by the authors sharing the same "fingerprint".
// (usually a hash of an IP subnet).
//
// Example: `ignoredAuthors = ['2fde80', '4b93e1']`.
//
export const ignoredAuthors: UserDataCollection = {
	name: 'ignoredAuthors',
	shortName: '🤐',

	type: 'list',

	schema: {
		type: 'string',
		description: 'Author ID (hex string)'
	},

	methods: {
		isIgnoredAuthor: ({ getFrom }) => (authorId) => {
			return getFrom(authorId) !== undefined
		},
		addIgnoredAuthor: 'addTo',
		removeIgnoredAuthor: 'removeFrom'
	},

	// `match()` must be defined for collections of type "list".
	//
	// `match()` is used for:
	// * Matching a record against a "primary key".
	// * Preventing the insertion of duplicate records.
	//
	match: (encoded, _) => encoded === _,

	// Remove old records when the limit is reached and new records are added.
	maxCount: 1000
}