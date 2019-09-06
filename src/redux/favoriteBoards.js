import { ReduxModule } from 'react-website'

import UserData from '../UserData/UserData'

const redux = new ReduxModule()

export const getFavoriteBoards = redux.simpleAction(
	_getFavoriteBoards,
	'favoriteBoards'
)

export const addFavoriteBoard = redux.simpleAction(
	(boardId) => {
		UserData.addFavoriteBoards(boardId)
		return _getFavoriteBoards()
	},
	'favoriteBoards'
)

export const removeFavoriteBoard = redux.simpleAction(
	(boardId, threadId) => {
		UserData.removeFavoriteBoards(boardId)
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