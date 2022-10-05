import applyDarkMode from 'frontend-lib/utility/style/applyDarkMode.js'
import applyFontSize from 'frontend-lib/utility/style/applyFontSize.js'
import applyLeftHanded from 'frontend-lib/utility/style/applyLeftHanded.js'
import autoDarkMode from 'frontend-lib/utility/style/autoDarkMode.js'

import getUserSettings from '../../UserSettings.js'
import getSettings from './getSettings.js'

import { setDarkMode } from '../../redux/app.js'

import { applyTheme } from '../themes.js'

export default async function applySettings({
	dispatch,
	userSettings = getUserSettings()
}) {
	const settings = getSettings({ userSettings })
	autoDarkMode(settings.autoDarkMode, {
		setDarkMode: (value) => dispatch(setDarkMode(value))
	})
	if (!settings.autoDarkMode) {
		dispatch(setDarkMode(settings.darkMode))
	}
	applyFontSize(settings.fontSize)
	applyLeftHanded(settings.leftHanded)
	// The theme is applied last because it's asynchronous.
	await applyTheme(settings.theme)
	return settings
}