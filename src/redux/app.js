import { ReduxModule } from 'react-pages'

import { areCookiesAccepted } from 'webapp-frontend/src/utility/cookiePolicy'
import { applyDarkMode } from 'webapp-frontend/src/utility/style'

const redux = new ReduxModule()

export const showSidebar = redux.simpleAction(
	(state, shouldBeShown) => ({
		...state,
		isSidebarShown: shouldBeShown
	})
)

export const hideSidebar = redux.simpleAction(
	(state) => ({
		...state,
		isSidebarShown: false
	})
)

const _setDarkMode = redux.simpleAction(
	(state, darkMode) => ({ ...state, darkMode })
)
export const setDarkMode = (darkMode) => {
	// Apply `.dark`/`.light` CSS class to `<body/>` before Redux is initialized.
	applyDarkMode(darkMode)
	// Dispatch the Redux action. It will be processed after the page is loaded.
	return _setDarkMode(darkMode)
}

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