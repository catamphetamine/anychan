import type { State } from '@/types'

import { ReduxModule } from 'react-pages'

import _logOut from '../api/logOut.js'

const redux = new ReduxModule<State['auth']>()

export const setAuthState = redux.simpleAction(
	(state, authState) => ({
		...state,
		...authState
	})
)

export const setLoggedIn = redux.simpleAction(
	(state, { accessToken }) => ({
		...state,
		accessToken
	})
)

export const setLoggedOut = redux.simpleAction(
	(state) => ({
		...state,
		accessToken: undefined
	})
)

export default redux.reducer()