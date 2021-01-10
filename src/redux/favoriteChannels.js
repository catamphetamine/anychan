import { ReduxModule } from 'react-pages'

import UserData from '../UserData/UserData'

const redux = new ReduxModule()

export const getFavoriteChannels = redux.simpleAction(
	(state) => ({
		...state,
		favoriteChannels: _getFavoriteChannels()
	})
)

export const addFavoriteChannel = redux.simpleAction(
	(state, channel) => {
		UserData.addFavoriteChannel(channel)
		return {
			...state,
			favoriteChannels: _getFavoriteChannels()
		}
	}
)

export const setFavoriteChannels = redux.simpleAction(
	(state, favoriteChannels) => {
		UserData.setFavoriteChannels(favoriteChannels)
		return {
			...state,
			favoriteChannels: _getFavoriteChannels()
		}
	}
)

export const removeFavoriteChannel = redux.simpleAction(
	(state, channel) => {
		UserData.removeFavoriteChannel(channel)
		return {
			...state,
			favoriteChannels: _getFavoriteChannels()
		}
	}
)

export default redux.reducer({
	favoriteChannels: typeof window === 'undefined' ? [] : _getFavoriteChannels()
})

function _getFavoriteChannels() {
	return UserData.getFavoriteChannels()
}