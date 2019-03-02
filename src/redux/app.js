import { ReduxModule } from 'react-website'

import { getSettings as getNormalizedSettings } from '../utility/settings'

const redux = new ReduxModule()

export const getSettings = redux.action(
	() => async () => getNormalizedSettings(getCustomSettings()),
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

export default redux.reducer()

/**
 * Gets user's settings from `localStorage`.
 * @return {object}
 */
function getCustomSettings() {
	let settings = {}
	if (localStorage.settings) {
		try {
			settings = JSON.parse(localStorage.settings)
		} catch (error) {
			if (error instanceof SyntaxError) {
				console.error(`Invalid settings JSON:\n\n${localStorage.settings}`)
			} else {
				throw error
			}
		}
	}
	return settings
}

/**
 * Applies a setting and saves it to `localStorage`.
 * @param  {string} name
 * @param  {(string|number|boolean)} [value] — Will reset the setting if `value` is `undefined`.
 * @return {object} The updated settings
 */
function saveSetting(name, value) {
	const settings = getCustomSettings()
	if (value === undefined) {
		delete settings[name]
	} else {
		settings[name] = value
	}
	localStorage.settings = JSON.stringify(settings)
	return getNormalizedSettings(settings)
}