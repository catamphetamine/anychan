import { ReduxModule } from 'react-pages'

import getSettings_ from '../utility/settings/getSettings.js'

const redux = new ReduxModule()

export const getSettings = redux.simpleAction(
	(state, { userSettings }) => {
		return {
			...state,
			settings: getSettings_({ userSettings })
		}
	}
)

export const resetSettings = redux.simpleAction(
	(state, { userSettings }) => {
		userSettings.reset()
		return {
			...state,
			settings: getSettings_({ userSettings })
		}
	}
)

export const replaceSettings = redux.simpleAction(
	(state, { settings: newSettings, userSettings }) => {
		userSettings.replace(newSettings)
		return {
			...state,
			settings: getSettings_({ userSettings })
		}
	}
)

export const saveLocale = redux.simpleAction(
	(state, { locale, userSettings }) => {
		return {
			...state,
			settings: saveSetting('locale', locale, { userSettings })
		}
	}
)

export const saveTheme = redux.simpleAction(
	(state, { theme, userSettings }) => {
		return {
			...state,
			settings: saveSetting('theme', theme, { userSettings })
		}
	}
)

export const saveFontSize = redux.simpleAction(
	(state, { fontSize, userSettings }) => {
		return {
			...state,
			settings: saveSetting('fontSize', fontSize, { userSettings })
		}
	}
)

export const saveProxyUrl = redux.simpleAction(
	(state, { proxyUrl, userSettings }) => {
		return {
			...state,
			settings: saveSetting('proxyUrl', proxyUrl, { userSettings })
		}
	}
)

export const saveAutoSuggestFavoriteChannels = redux.simpleAction(
	(state, { autoSuggestFavoriteChannels, userSettings }) => {
		return {
			...state,
			settings: saveSetting('autoSuggestFavoriteChannels', autoSuggestFavoriteChannels, { userSettings })
		}
	}
)

export const saveDarkMode = redux.simpleAction(
	(state, { darkMode, userSettings }) => {
		// Disable "Auto Dark Mode" feature.
		saveSetting('autoDarkMode', false, { userSettings })
		return {
			...state,
			settings: saveSetting('darkMode', darkMode, { userSettings })
		}
	}
)

export const saveLeftHanded = redux.simpleAction(
	(state, { leftHanded, userSettings }) => {
		return {
			...state,
			settings: saveSetting('leftHanded', leftHanded, { userSettings })
		}
	}
)

export const saveGrammarCorrection = redux.simpleAction(
	(state, { grammarCorrection, userSettings }) => {
		return {
			...state,
			settings: saveSetting('grammarCorrection', grammarCorrection, { userSettings })
		}
	}
)

export const saveAutoDarkMode = redux.simpleAction(
	(state, { autoDarkMode, userSettings }) => {
		// Reset manual "Dark Mode" setting.
		saveSetting('darkMode', undefined, { userSettings })
		return {
			...state,
			settings: saveSetting('autoDarkMode', autoDarkMode, { userSettings })
		}
	}
)

export const saveChannelsView = redux.simpleAction(
	(state, { channelsView, userSettings }) => {
		return {
			...state,
			settings: saveSetting('channelsView', channelsView, { userSettings })
		}
	}
)

export const saveChannelView = redux.simpleAction(
	(state, { channelView, userSettings }) => {
		return {
			...state,
			settings: saveSetting('channelView', channelView, { userSettings })
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