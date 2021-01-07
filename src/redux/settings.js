import { ReduxModule } from 'react-pages'

import Settings from '../utility/settings'
import UserSettings from '../utility/UserSettings'

const redux = new ReduxModule()

export const getSettings = redux.simpleAction(
	(state) => ({
		...state,
		settings: Settings.get()
	})
)

export const resetSettings = redux.simpleAction(
	(state) => {
		UserSettings.reset()
		return {
			...state,
			settings: Settings.get()
		}
	}
)

export const replaceSettings = redux.simpleAction(
	(state, newSettings) => {
		UserSettings.replace(newSettings)
		return {
			...state,
			settings: Settings.get()
		}
	}
)

export const saveLocale = redux.simpleAction(
	(state, value) => {
		return {
			...state,
			settings: saveSetting('locale', value)
		}
	}
)

export const saveTheme = redux.simpleAction(
	(state, value) => {
		return {
			...state,
			settings: saveSetting('theme', value)
		}
	}
)

export const saveFontSize = redux.simpleAction(
	(state, value) => {
		return {
			...state,
			settings: saveSetting('fontSize', value)
		}
	}
)

export const saveProxyUrl = redux.simpleAction(
	(state, value) => {
		return {
			...state,
			settings: saveSetting('proxyUrl', value)
		}
	}
)

export const saveAutoSuggestFavoriteChannels = redux.simpleAction(
	(state, value) => {
		return {
			...state,
			settings: saveSetting('autoSuggestFavoriteChannels', value)
		}
	}
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

export const saveLeftHanded = redux.simpleAction(
	(state, value) => {
		return {
			...state,
			settings: saveSetting('leftHanded', value)
		}
	}
)

export const saveGrammarCorrection = redux.simpleAction(
	(state, value) => {
		return {
			...state,
			settings: saveSetting('grammarCorrection', value)
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

export const saveChannelsView = redux.simpleAction(
	(state, value) => {
		return {
			...state,
			settings: saveSetting('channelsView', value)
		}
	}
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
	return Settings.get()
}