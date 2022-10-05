import { ReduxModule } from 'react-pages'

import getUserData from '../UserData.js'

const redux = new ReduxModule('FAVORITE_CHANNELS')

export const getFavoriteChannels = redux.simpleAction(
	'GET_FAVORITE_CHANNELS',
	(state, { userData = getUserData() } = {}) => ({
		...state,
		favoriteChannels: userData.getFavoriteChannels()
	})
)

export const addFavoriteChannel = redux.simpleAction(
	(state, { channel, userData = getUserData() }) => {
		console.log('fasd')
		userData.addFavoriteChannel(channel)
		return {
			...state,
			favoriteChannels: userData.getFavoriteChannels()
		}
	}
)

export const setFavoriteChannels = redux.simpleAction(
	(state, { channels, userData = getUserData() }) => {
		userData.setFavoriteChannels(channels)
		return {
			...state,
			favoriteChannels: userData.getFavoriteChannels()
		}
	}
)

export const removeFavoriteChannel = redux.simpleAction(
	(state, { channel, userData = getUserData() }) => {
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