import applyFontSize from 'frontend-lib/utility/style/applyFontSize.js'
import applyLeftHanded from 'frontend-lib/utility/style/applyLeftHanded.js'
import autoDarkMode from 'frontend-lib/utility/style/autoDarkMode.js'
import applyDarkMode from 'frontend-lib/utility/style/applyDarkMode.js'

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

	applyDarkModeSettings({ settings, dispatch })

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

export function applyDarkModeSettings({ settings, dispatch }) {
	// Enters Dark Mode (when `value` is `true`) or Light Mode (when `value` is `false`).
	const enterDarkMode = (value) => {
		// Apply `.dark`/`.light` CSS class to `<body/>`.
		applyDarkMode(value)
		// `dispatch(setDarkMode())` calls `applyDarkMode()` under the hood.
		dispatch(setDarkMode(value))
	}

	// If Dark Mode / Light Mode setting should follow the OS settings
	// then apply the Dark Mode or the Light Mode according to the OS settings.
	autoDarkMode(settings.autoDarkMode, {
		setDarkMode: enterDarkMode
	})

	// If Dark Mode / Light Mode setting shouldn't follow the OS settings
	// and should instead be custom-enabled or custom-disabled by the user
	// then apply the Dark Mode or the Light Mode according to the user's preference.
	if (!settings.autoDarkMode) {
		enterDarkMode(settings.darkMode)
	}
}