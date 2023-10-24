import { ReduxModule } from 'react-pages'

import _logIn from '../api/logIn.js'
import _logOut from '../api/logOut.js'

const redux = new ReduxModule()

export const logIn = redux.action(
	({
		token,
		userSettings,
		dataSource,
		messages
	}) => async http => {
		return await _logIn({
			token,
			userSettings,
			dataSource,
			messages,
			http
		})
	},
	(state, result) => ({
		...state,
		...result
	})
)

export const logOut = redux.action(
	({
		userSettings,
		dataSource,
		messages
	}) => async http => {
		await _logOut({
			userSettings,
			dataSource,
			messages,
			http
		})
	},
	(state, result) => ({
		...state
	})
)

export default redux.reducer()