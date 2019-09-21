import { ReduxModule } from 'react-website'

import { areCookiesAccepted } from 'webapp-frontend/src/utility/cookiePolicy'
import { applyDarkMode } from 'webapp-frontend/src/utility/style'

import Settings from '../utility/settings'
import UserSettings from '../utility/UserSettings'

const redux = new ReduxModule()

export const getSettings = redux.simpleAction(
	() => Settings.get(),
	'settings'
)

export const resetSettings = redux.simpleAction(
	() => {
		UserSettings.reset()
		return Settings.get()
	},
	'settings'
)

export const replaceSettings = redux.simpleAction(
	(newSettings) => {
		UserSettings.set(newSettings)
		return Settings.get()
	},
	'settings'
)

export const saveLocale = redux.simpleAction(
	(locale) => saveSetting('locale', locale),
	'settings'
)

export const saveTheme = redux.simpleAction(
	(theme) => saveSetting('theme', theme),
	'settings'
)

export const saveFontSize = redux.simpleAction(
	(fontSize) => saveSetting('fontSize', fontSize),
	'settings'
)

export const saveAutoAddFavoriteBoards = redux.simpleAction(
	(value) => saveSetting('autoAddFavoriteBoards', value),
	'settings'
)

export const showSidebar = redux.simpleAction(
	(shouldBeShown) => shouldBeShown,
	'isSidebarShown'
)

export const hideSidebar = redux.simpleAction(
	() => false,
	'isSidebarShown'
)

export const saveDarkMode = redux.simpleAction(
	(state, value) => {
		// Disable "Auto Dark Mode" feature.
		saveSetting('autoDarkMode', false)
		return {
			...state,
			settings: saveSetting('darkMode', value)
		}
	}
)

export const saveAutoDarkMode = redux.simpleAction(
	(state, value) => {
		// Reset manual "Dark Mode" setting.
		saveSetting('darkMode', undefined)
		return {
			...state,
			settings: saveSetting('autoDarkMode', value)
		}
	}
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

export const saveBoardsView = redux.simpleAction(
	(state, boardsView) => ({
		...state,
		settings: saveSetting('boardsView', boardsView)
	})
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

/**
 * Applies a setting and saves it to `localStorage`.
 * @param  {string} name
 * @param  {(string|number|boolean)} [value] — Will reset the setting if `value` is `undefined`.
 * @return {object} The updated settings
 */
function saveSetting(name, value) {
	UserSettings.set(name, value)
	return Settings.get()
}