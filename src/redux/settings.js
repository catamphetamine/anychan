import { ReduxModule } from 'react-website'

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
	(value) => saveSetting('locale', value),
	'settings'
)

export const saveTheme = redux.simpleAction(
	(value) => saveSetting('theme', value),
	'settings'
)

export const saveFontSize = redux.simpleAction(
	(value) => saveSetting('fontSize', value),
	'settings'
)

export const saveAutoSuggestFavoriteBoards = redux.simpleAction(
	(value) => saveSetting('autoSuggestFavoriteBoards', value),
	'settings'
)

export const saveDarkMode = redux.simpleAction(
	(value) => {
		// Disable "Auto Dark Mode" feature.
		saveSetting('autoDarkMode', false)
		return saveSetting('darkMode', value)
	},
	'settings'
)

export const saveAutoDarkMode = redux.simpleAction(
	(value) => {
		// Reset manual "Dark Mode" setting.
		saveSetting('darkMode', undefined)
		return saveSetting('autoDarkMode', value)
	},
	'settings'
)

export const saveBoardsView = redux.simpleAction(
	(value) => saveSetting('boardsView', value),
	'settings'
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