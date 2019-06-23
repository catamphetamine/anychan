import { ReduxModule } from 'react-website'

import { getObject, setObject, deleteObject } from 'webapp-frontend/src/utility/localStorage'

import { getSettings as getNormalizedSettings, applySettings } from '../utility/settings'

const redux = new ReduxModule()

export const getSettings = redux.action(
	() => async () => getNormalizedSettings(getCustomSettings()),
	'settings'
)

export const resetSettings = redux.action(
	() => async () => {
		resetCustomSettings()
		const settings = getNormalizedSettings()
		applySettings(settings)
		return settings
	},
	'settings'
)

export const saveLocale = redux.action(
	(locale) => async () => saveSetting('locale', locale),
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
 * Resets user's settings in `localStorage`.
 */
function resetCustomSettings() {
	deleteObject('settings')
}

/**
 * Gets user's settings from `localStorage`.
 * @return {object} [settings]
 */
function getCustomSettings() {
	return getObject('settings')
}

/**
 * Applies a setting and saves it to `localStorage`.
 * @param  {string} name
 * @param  {(string|number|boolean)} [value] — Will reset the setting if `value` is `undefined`.
 * @return {object} The updated settings
 */
function saveSetting(name, value) {
	const settings = getCustomSettings() || {}
	if (value === undefined) {
		delete settings[name]
	} else {
		settings[name] = value
	}
	setObject('settings', settings)
	return getNormalizedSettings(settings)
}