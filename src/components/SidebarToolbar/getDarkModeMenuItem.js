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
			dispatch(setDarkMode(!darkMode))
			dispatch(saveDarkMode({ darkMode: !darkMode, userSettings }))
			autoDarkMode(false, {
				setDarkMode: (value) => dispatch(applyDarkMode(value))
			})
			measure()
		},
		isSelected: darkMode,
		icon: MoonIconOutline,
		iconSelected: MoonIconFill
	}
}
