import { ReduxModule } from 'react-website'

import { areCookiesAccepted } from 'webapp-frontend/src/utility/cookiePolicy'
import { applyDarkMode } from 'webapp-frontend/src/utility/style'

const redux = new ReduxModule()

export const showSidebar = redux.simpleAction(
	(shouldBeShown) => shouldBeShown,
	'isSidebarShown'
)

export const hideSidebar = redux.simpleAction(
	() => false,
	'isSidebarShown'
)

export const setDarkMode = redux.simpleAction(
	(state, darkMode) => {
		applyDarkMode(darkMode)
		return {
			...state,
			darkMode
		}
	}
)

export const setCookiesAccepted = redux.simpleAction(
	(state) => ({ ...state, cookiesAccepted: true })
)

export const setOfflineMode = redux.simpleAction(
	(state) => ({ ...state, offline: true })
)

export const setSidebarMode = redux.simpleAction(
	(state, sidebarMode) => ({ ...state, sidebarMode })
)

export default redux.reducer({
	cookiesAccepted: areCookiesAccepted(),
	sidebarMode: 'boards'
})