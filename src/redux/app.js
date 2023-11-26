import { ReduxModule } from 'react-pages'

const redux = new ReduxModule()

export const setDataSourceInfoForMeta = redux.simpleAction(
	(state, dataSourceInfoForMeta) => ({ ...state, dataSourceInfoForMeta })
)

export const setShowSidebar = redux.simpleAction(
	(state, isSidebarShown) => ({ ...state, isSidebarShown })
)

export const setDarkMode = redux.simpleAction(
	(state, darkMode) => ({ ...state, darkMode })
)

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