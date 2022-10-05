// Stores the "fingerprint" IDs of the authors this user has chosen to "ignore".
//
// Users can "ignore" all comments left by the authors sharing the same "fingerprint".
// (usually a hash of an IP subnet).
//
// Example: `ignoredAuthors = ['2fde80', '4b93e1']`.
//
export default {
	name: 'ignoredAuthors',
	shortName: '🤐',

	type: 'list',

	schema: {
		type: 'string',
		description: 'Author ID (hex string)'
	},

	methods: {
		addIgnoredAuthor: 'addTo',
		removeIgnoredAuthor: 'removeFrom'
	},

	// `isEqual()` must be defined for collections of type "list".
	//
	// `isEqual()` is used for:
	// * Matching a record against a "primary key".
	// * Preventing the insertion of duplicate records.
	//
	// `isEqual()` should support both encoded and non-encoded records.
	//
	isEqual: (a, b) => a === b,

	// Remove old records when the limit is reached and new records are added.
	maxCount: 1000
}