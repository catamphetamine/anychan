import { ReduxModule } from 'react-website'

import UserData from '../UserData/UserData'

const redux = new ReduxModule()

export const getFavoriteBoards = redux.simpleAction(
	_getFavoriteBoards,
	'favoriteBoards'
)

export const addFavoriteBoard = redux.simpleAction(
	(board) => {
		UserData.addFavoriteBoards(board)
		return _getFavoriteBoards()
	},
	'favoriteBoards'
)

export const setFavoriteBoards = redux.simpleAction(
	(favoriteBoards) => {
		UserData.setFavoriteBoards(favoriteBoards)
		return _getFavoriteBoards()
	},
	'favoriteBoards'
)

export const removeFavoriteBoard = redux.simpleAction(
	(board) => {
		UserData.removeFavoriteBoards(board)
		return _getFavoriteBoards()
	},
	'favoriteBoards'
)

export default redux.reducer({
	favoriteBoards: typeof window === 'undefined' ? [] : _getFavoriteBoards()
})

function _getFavoriteBoards() {
	return UserData.getFavoriteBoards()
}