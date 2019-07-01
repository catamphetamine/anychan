import { ReduxModule } from 'react-website'

import { getSettings as _getSettings } from '../utility/settings'
import UserSettings from '../utility/UserSettings'

const redux = new ReduxModule()

export const getSettings = redux.simpleAction(
	(state) => ({
		...state,
		settings: _getSettings()
	})
)

export const resetSettings = redux.simpleAction(
	(state) => {
		UserSettings.reset()
		return {
			...state,
			settings: _getSettings()
		}
	}
)

export const replaceSettings = redux.simpleAction(
	(state, settings) => {
		UserSettings.set(settings)
		return {
			...state,
			settings: _getSettings()
		}
	}
)

export const saveLocale = redux.action(
	(locale) => async () => saveSetting('locale', locale),
	'settings'
)

export const saveTheme = redux.action(
	(theme) => async () => saveSetting('theme', theme),
	'settings'
)

export const saveFontSize = redux.action(
	(fontSize) => async () => saveSetting('fontSize', fontSize),
	'settings'
)

export const showSidebar = redux.simpleAction(
	(state, params) => ({
		...state,
		isSidebarShown: true
	})
)

export const hideSidebar = redux.simpleAction(
	(state, params) => ({
		...state,
		isSidebarShown: false
	})
)

export const toggleSidebar = redux.simpleAction(
	(state, params) => ({
		...state,
		isSidebarShown: !state.isSidebarShown
	})
)

export const toggleNightMode = redux.simpleAction(
	(state, params) => ({
		...state,
		isNightMode: !state.isNightMode
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

export default redux.reducer()

/**
 * Applies a setting and saves it to `localStorage`.
 * @param  {string} name
 * @param  {(string|number|boolean)} [value] — Will reset the setting if `value` is `undefined`.
 * @return {object} The updated settings
 */
function saveSetting(name, value) {
	UserSettings.set(name, value)
	return _getSettings()
}