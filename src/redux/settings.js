import { ReduxModule } from 'react-pages'

import getSettings_ from '../utility/settings/getSettings.js'
import getUserSettings from '../UserSettings.js'

const redux = new ReduxModule()

export const getSettings = redux.simpleAction(
	(state) => {
		const userSettings = getUserSettings()
		return {
			...state,
			settings: getSettings_({ userSettings })
		}
	}
)

export const resetSettings = redux.simpleAction(
	(state) => {
		const userSettings = getUserSettings()
		userSettings.reset()
		return {
			...state,
			settings: getSettings_({ userSettings })
		}
	}
)

export const replaceSettings = redux.simpleAction(
	(state, newSettings) => {
		const userSettings = getUserSettings()
		userSettings.replace(newSettings)
		return {
			...state,
			settings: getSettings_({ userSettings })
		}
	}
)

export const saveLocale = redux.simpleAction(
	(state, value) => {
		const userSettings = getUserSettings()
		return {
			...state,
			settings: saveSetting('locale', value, { userSettings })
		}
	}
)

export const saveTheme = redux.simpleAction(
	(state, value) => {
		const userSettings = getUserSettings()
		return {
			...state,
			settings: saveSetting('theme', value, { userSettings })
		}
	}
)

export const saveFontSize = redux.simpleAction(
	(state, value) => {
		const userSettings = getUserSettings()
		return {
			...state,
			settings: saveSetting('fontSize', value, { userSettings })
		}
	}
)

export const saveProxyUrl = redux.simpleAction(
	(state, value) => {
		const userSettings = getUserSettings()
		return {
			...state,
			settings: saveSetting('proxyUrl', value, { userSettings })
		}
	}
)

export const saveAutoSuggestFavoriteChannels = redux.simpleAction(
	(state, value) => {
		const userSettings = getUserSettings()
		return {
			...state,
			settings: saveSetting('autoSuggestFavoriteChannels', value, { userSettings })
		}
	}
)

export const saveDarkMode = redux.simpleAction(
	(state, value) => {
		const userSettings = getUserSettings()
		// Disable "Auto Dark Mode" feature.
		saveSetting('autoDarkMode', false, { userSettings })
		return {
			...state,
			settings: saveSetting('darkMode', value, { userSettings })
		}
	}
)

export const saveLeftHanded = redux.simpleAction(
	(state, value) => {
		const userSettings = getUserSettings()
		return {
			...state,
			settings: saveSetting('leftHanded', value, { userSettings })
		}
	}
)

export const saveGrammarCorrection = redux.simpleAction(
	(state, value) => {
		const userSettings = getUserSettings()
		return {
			...state,
			settings: saveSetting('grammarCorrection', value, { userSettings })
		}
	}
)

export const saveAutoDarkMode = redux.simpleAction(
	(state, value) => {
		const userSettings = getUserSettings()
		// Reset manual "Dark Mode" setting.
		saveSetting('darkMode', undefined, { userSettings })
		return {
			...state,
			settings: saveSetting('autoDarkMode', value, { userSettings })
		}
	}
)

export const saveChannelsView = redux.simpleAction(
	(state, value) => {
		const userSettings = getUserSettings()
		return {
			...state,
			settings: saveSetting('channelsView', value, { userSettings })
		}
	}
)

export const saveChannelView = redux.simpleAction(
	(state, value) => {
		const userSettings = getUserSettings()
		return {
			...state,
			settings: saveSetting('channelView', value, { userSettings })
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
function saveSetting(name, value, { userSettings }) {
	userSettings.set(name, value)
	return getSettings_({ userSettings })
}