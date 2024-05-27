import type { UserDataCollection } from '@/types'

// The list of the user's "favorite channels".
//
// Users can add channels to the list of "Favorite channels"
// in order for those channels to stay "pinned" at the top
// in the sidebar, so that they don't have to scroll down looking for them.
//
// Example: `favoriteChannels = [{ id: 'a', title: 'Anime' }, ...]`.
//
export const favoriteChannels: UserDataCollection = {
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
		removeFavoriteChannel: 'removeFrom',
		isFavoriteChannel: ({ getFrom }) => (channel) => {
			return getFrom(channel) !== undefined
		}
	},

	// `match()` must be defined for collections of type "list".
	//
	// `match()` is used for:
	// * Matching a record against a "primary key".
	// * Preventing the insertion of duplicate records.
	//
	match: (encoded, _) => encoded.id === _.id
}