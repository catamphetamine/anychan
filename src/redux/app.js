import { ReduxModule } from 'react-pages'

import applyDarkMode from 'frontend-lib/utility/style/applyDarkMode.js'

const redux = new ReduxModule()

export const setShowSidebar = redux.simpleAction(
	(state, isSidebarShown) => ({ ...state, isSidebarShown })
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
	(state, cookiesAccepted) => ({ ...state, cookiesAccepted })
)

export const setOfflineMode = redux.simpleAction(
	(state, offline) => ({ ...state, offline })
)

export const setSidebarMode = redux.simpleAction(
	(state, sidebarMode) => ({ ...state, sidebarMode })
)

export const setShowPageLoadingIndicator = redux.simpleAction(
	(state, showPageLoadingIndicator) => ({ ...state, showPageLoadingIndicator })
)

export const setBackgroundLightMode = redux.simpleAction(
	(state, backgroundLightMode) => ({ ...state, backgroundLightMode })
)

export const setBackgroundDarkMode = redux.simpleAction(
	(state, backgroundDarkMode) => ({ ...state, backgroundDarkMode })
)

export default redux.reducer({
	sidebarMode: 'channels'
})