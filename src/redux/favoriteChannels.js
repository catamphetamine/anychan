import { ReduxModule } from 'react-pages'

const redux = new ReduxModule('FAVORITE_CHANNELS')

export const getFavoriteChannels = redux.simpleAction(
	'GET_FAVORITE_CHANNELS',
	(state, { userData }) => ({
		...state,
		favoriteChannels: userData.getFavoriteChannels()
	})
)

export const addFavoriteChannel = redux.simpleAction(
	(state, { channel, userData }) => {
		userData.addFavoriteChannel(channel)
		return {
			...state,
			favoriteChannels: userData.getFavoriteChannels()
		}
	}
)

export const setFavoriteChannels = redux.simpleAction(
	(state, { channels, userData }) => {
		userData.setFavoriteChannels(channels)
		return {
			...state,
			favoriteChannels: userData.getFavoriteChannels()
		}
	}
)

export const removeFavoriteChannel = redux.simpleAction(
	(state, { channel, userData }) => {
		userData.removeFavoriteChannel(channel)
		return {
			...state,
			favoriteChannels: userData.getFavoriteChannels()
		}
	}
)

export default redux.reducer({
	favoriteChannels: []
})