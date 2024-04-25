import type { Dispatch } from 'redux'
import type { UserSettings, UserSettingsJson } from '../../types/index.js'

import applyFontSize from 'frontend-lib/utility/style/applyFontSize.js'
import applyLeftHanded from 'frontend-lib/utility/style/applyLeftHanded.js'
import autoDarkMode from 'frontend-lib/utility/style/autoDarkMode.js'
import applyDarkMode from 'frontend-lib/utility/style/applyDarkMode.js'

import { setDarkMode } from '../../redux/app.js'

import { applyTheme, applyCustomCss } from '../themes.js'
import { applyBackground } from '../background.js'

import getSettings from './getSettings.js'

export default async function applySettings({
	userSettings,
	settings,
	...rest
}: {
	userSettings?: UserSettings,
	settings?: UserSettingsJson,
	dispatch: Dispatch
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

	applyBackgroundDark({ settings, dispatch })
	applyBackgroundLight({ settings, dispatch })

	applyFontSize(settings.fontSize)
	applyLeftHanded(settings.leftHanded)

	// The theme is applied last because it's asynchronous
	// so that it doesn't delay the application of other settings.
	// For example, initial settings are applied at page load,
	// and there's no `await` there when it calls this function.
	await applyTheme(settings.theme, { themes: settings.themes })

	if (settings.css) {
		applyCustomCss(settings.css)
	}

	return settings
}

export function applyBackgroundDark({ settings, dispatch }: { settings: UserSettingsJson, dispatch: Dispatch }) {
	applyBackground(settings.backgroundDarkMode, 'dark', { dispatch, backgrounds: settings.backgroundsDarkMode });
}

export function applyBackgroundLight({ settings, dispatch }: { settings: UserSettingsJson, dispatch: Dispatch }) {
	applyBackground(settings.backgroundLightMode, 'light', { dispatch, backgrounds: settings.backgroundsLightMode });
}

export function applyDarkModeSettings({ settings, dispatch }: { settings: UserSettingsJson, dispatch: Dispatch }) {
	// Enters Dark Mode (when `value` is `true`) or Light Mode (when `value` is `false`).
	const enterDarkMode = (value: boolean) => {
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