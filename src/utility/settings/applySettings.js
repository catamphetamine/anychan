import applyDarkMode from 'frontend-lib/utility/style/applyDarkMode.js'
import applyFontSize from 'frontend-lib/utility/style/applyFontSize.js'
import applyLeftHanded from 'frontend-lib/utility/style/applyLeftHanded.js'
import autoDarkMode from 'frontend-lib/utility/style/autoDarkMode.js'

import { setDarkMode, setColorfulBackground } from '../../redux/app.js'

import { applyTheme } from '../themes.js'

import getSettings from './getSettings.js'

export default async function applySettings({
	dispatch,
	userSettings
}) {
	const settings = getSettings({ userSettings })

	autoDarkMode(settings.autoDarkMode, {
		setDarkMode: (value) => dispatch(setDarkMode(value))
	})

	if (!settings.autoDarkMode) {
		dispatch(setDarkMode(settings.darkMode))
	}

	dispatch(setColorfulBackground(settings.colorfulBackground))

	applyFontSize(settings.fontSize)
	applyLeftHanded(settings.leftHanded)

	// The theme is applied last because it's asynchronous.
	await applyTheme(settings.theme, { userSettings })

	return settings
}