// The list of the user's "favorite channels".
//
// Users can add channels to the list of "Favorite channels"
// in order for those channels to stay "pinned" at the top
// in the sidebar, so that they don't have to scroll down looking for them.
//
// Example: `favoriteChannels = [{ id: 'a', title: 'Anime' }, ...]`.
//
export default {
	name: 'favoriteChannels',
	shortName: '📚',

	type: 'list',

	schema: {
		id: {
			type: 'string',
			description: 'Channel ID'
		},
		title: {
			type: 'string',
			description: 'Channel Title',
			// On `8ch.net`, some user-created boards didn't have titles.
			required: false
		}
	},

	methods: {
		addFavoriteChannel: 'addTo',
		removeFavoriteChannel: 'removeFrom'
	},

	// `isEqual()` must be defined for collections of type "list".
	//
	// `isEqual()` is used for:
	// * Matching a record against a "primary key".
	// * Preventing the insertion of duplicate records.
	//
	// `isEqual()` should support both encoded and non-encoded records.
	//
	isEqual: (a, b) => a.id === b.id
}