import applyDarkMode from 'frontend-lib/utility/style/applyDarkMode.js'
import applyFontSize from 'frontend-lib/utility/style/applyFontSize.js'
import applyLeftHanded from 'frontend-lib/utility/style/applyLeftHanded.js'
import autoDarkMode from 'frontend-lib/utility/style/autoDarkMode.js'

import { setDarkMode, setBackgroundLightMode, setBackgroundDarkMode } from '../../redux/app.js'

import { applyTheme } from '../themes.js'

import getSettings from './getSettings.js'

export default async function applySettings({
	userSettings,
	settings,
	...rest
}) {
	// If `userSettings` parameter was passed, convert it to `settings` object
	// and call the function again.
	if (userSettings) {
		return applySettings({
			settings: getSettings({ userSettings }),
			...rest
		})
	}

	const { dispatch } = rest

	autoDarkMode(settings.autoDarkMode, {
		setDarkMode: (value) => dispatch(setDarkMode(value))
	})

	if (!settings.autoDarkMode) {
		dispatch(setDarkMode(settings.darkMode))
	}

	dispatch(setBackgroundDarkMode(settings.backgroundDarkMode))
	dispatch(setBackgroundLightMode(settings.backgroundLightMode))

	applyFontSize(settings.fontSize)
	applyLeftHanded(settings.leftHanded)

	// The theme is applied last because it's asynchronous
	// so that it doesn't delay the application of other settings.
	// For example, initial settings are applied at page load,
	// and there's no `await` there when it calls this function.
	await applyTheme(settings.theme, { themes: settings.themes })

	return settings
}