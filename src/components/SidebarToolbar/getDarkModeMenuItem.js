import { areCookiesAccepted } from 'frontend-lib/utility/cookiePolicy.js'

import { notify } from '../../redux/notifications.js'
import { setDarkMode } from '../../redux/app.js'
import { saveDarkMode } from '../../redux/settings.js'

import autoDarkMode from 'frontend-lib/utility/style/autoDarkMode.js'
import applyDarkMode from 'frontend-lib/utility/style/applyDarkMode.js'

import MoonIconOutline from 'frontend-lib/icons/fill-and-outline/moon-outline.svg'
import MoonIconFill from 'frontend-lib/icons/fill-and-outline/moon-fill.svg'

export default function getDarkModeMenuItem({
	messages,
	dispatch,
	measure,
	darkMode,
	userSettings
}) {
	return {
		title: messages.darkMode,
		onClick: () => {
			if (!areCookiesAccepted()) {
				return dispatch(notify(messages.cookies.required))
			}

			// Enters Dark Mode (when `value` is `true`) or Light Mode (when `value` is `false`).
			const enterDarkMode = (value) => {
				// Apply `.dark`/`.light` CSS class to `<body/>`.
				applyDarkMode(value)
				// `dispatch(setDarkMode())` calls `applyDarkMode()` under the hood.
				dispatch(setDarkMode(value))
			}

			// Apply `.dark`/`.light` CSS class to `<body/>`.
			enterDarkMode(!darkMode)
			autoDarkMode(false, {
				setDarkMode: enterDarkMode
			})

			// Save the setting.
			dispatch(saveDarkMode({ darkMode: !darkMode, userSettings }))

			// Re-measure page elements because their dimensions or spacings
			// might be different in Light Mode and Dark Mode.
			measure()
		},
		isSelected: darkMode,
		icon: MoonIconOutline,
		iconSelected: MoonIconFill
	}
}
