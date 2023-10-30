import { ReduxModule } from 'react-pages'

import _logIn from '../api/logIn.js'
import _logOut from '../api/logOut.js'

const redux = new ReduxModule()

export const setAuthState = redux.simpleAction(
	(state, authState) => ({
		...state,
		...authState
	})
)

export const logIn = redux.action(
	({
		token,
		tokenPassword,
		...rest
	}) => async http => {
		return await _logIn({
			token,
			tokenPassword,
			...rest,
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
	(state) => ({
		...state,
		accessToken: undefined
	})
)

export default redux.reducer()