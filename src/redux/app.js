import { ReduxModule } from 'react-website'

import { areCookiesAccepted } from 'webapp-frontend/src/utility/cookiePolicy'

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

export const showSidebar = redux.simpleAction(
	() => true,
	'isSidebarShown'
)

export const hideSidebar = redux.simpleAction(
	() => false,
	'isSidebarShown'
)

export const toggleSidebar = redux.simpleAction(
	(state) => ({
		...state,
		isSidebarShown: !state.isSidebarShown
	})
)

export const toggleDarkMode = redux.simpleAction(
	(state) => ({
		...state,
		settings: saveSetting('darkMode', !state.settings.darkMode)
	})
)

export const toggleTrackedThreads = redux.simpleAction(
	(state, params) => ({
		...state,
		areTrackedThreadsShown: !state.areTrackedThreadsShown
	})
)

export const toggleNotifications = redux.simpleAction(
	(state, params) => ({
		...state,
		areNotificationsShown: !state.areNotificationsShown
	})
)

export const setCookiesAccepted = redux.simpleAction(
	(state) => ({ ...state, cookiesAccepted: true })
)

export const setOfflineMode = redux.simpleAction(
	(state) => ({ ...state, offline: true })
)

export default redux.reducer({
	cookiesAccepted: areCookiesAccepted()
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