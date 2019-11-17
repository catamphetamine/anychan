import { ReduxModule } from 'react-pages'

import UserData from '../UserData/UserData'

const redux = new ReduxModule()

export const getFavoriteBoards = redux.simpleAction(
	(state) => ({
		...state,
		favoriteBoards: _getFavoriteBoards()
	})
)

export const addFavoriteBoard = redux.simpleAction(
	(state, board) => {
		UserData.addFavoriteBoards(board)
		return {
			...state,
			favoriteBoards: _getFavoriteBoards()
		}
	}
)

export const setFavoriteBoards = redux.simpleAction(
	(state, favoriteBoards) => {
		UserData.setFavoriteBoards(favoriteBoards)
		return {
			...state,
			favoriteBoards: _getFavoriteBoards()
		}
	}
)

export const removeFavoriteBoard = redux.simpleAction(
	(state, board) => {
		UserData.removeFavoriteBoards(board)
		return {
			...state,
			favoriteBoards: _getFavoriteBoards()
		}
	}
)

export default redux.reducer({
	favoriteBoards: typeof window === 'undefined' ? [] : _getFavoriteBoards()
})

function _getFavoriteBoards() {
	return UserData.getFavoriteBoards()
}