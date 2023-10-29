import { areCookiesAccepted } from 'frontend-lib/utility/cookiePolicy.js'

import { notify } from '../../redux/notifications.js'
import { setBackgroundLightMode, setBackgroundDarkMode } from '../../redux/app.js'
import { saveBackgroundLightMode, saveBackgroundDarkMode } from '../../redux/settings.js'

import { DEFAULT_BACKGROUNDS_DARK_MODE, DEFAULT_BACKGROUNDS_LIGHT_MODE } from '../../utility/settings/settingsDefaults.js'

import DogeColorfulGlassesIconOutline from '../../../assets/images/icons/menu/doge-colorful-glasses-outline.svg'
import DogeColorfulGlassesIconFill from '../../../assets/images/icons/menu/doge-colorful-glasses-fill.svg'

export default function getColorfulBackgroundMenuItem({
	messages,
	dispatch,
	measure,
	backgroundLightMode,
	backgroundDarkMode,
	userSettings
}) {
	const isBackgroundEnabled = backgroundLightMode || backgroundDarkMode

	return {
		title: messages.colorfulBackground,
		onClick: () => {
			if (!areCookiesAccepted()) {
				return dispatch(notify(messages.cookies.required))
			}

			const backgroundLightMode = isBackgroundEnabled ? undefined : getRandomElementOfArray(DEFAULT_BACKGROUNDS_LIGHT_MODE)
			const backgroundDarkMode = isBackgroundEnabled ? undefined : getRandomElementOfArray(DEFAULT_BACKGROUNDS_DARK_MODE)

			dispatch(setBackgroundLightMode(backgroundLightMode))
			dispatch(setBackgroundDarkMode(backgroundDarkMode))

			dispatch(saveBackgroundLightMode({ backgroundLightMode, userSettings }))
			dispatch(saveBackgroundDarkMode({ backgroundDarkMode, userSettings }))

			measure()
		},
		isSelected: isBackgroundEnabled,
		icon: DogeColorfulGlassesIconOutline,
		iconSelected: DogeColorfulGlassesIconFill
	}
}

function getRandomElementOfArray(array) {
	return array[Math.floor(Math.random() * array.length)]
}
