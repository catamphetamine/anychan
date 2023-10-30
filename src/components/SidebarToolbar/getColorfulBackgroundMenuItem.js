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
	prevBackgroundLightMode,
	prevBackgroundDarkMode,
	setPrevBackgroundLightMode,
	setPrevBackgroundDarkMode,
	userSettings
}) {
	const isBackgroundEnabled = backgroundLightMode || backgroundDarkMode

	return {
		title: messages.colorfulBackground,
		onClick: () => {
			if (!areCookiesAccepted()) {
				return dispatch(notify(messages.cookies.required))
			}

			if (isBackgroundEnabled) {
				setPrevBackgroundLightMode(backgroundLightMode)
				setPrevBackgroundDarkMode(backgroundDarkMode)
			}

			const backgroundLightModeNew = isBackgroundEnabled ? undefined : getRandomElementOfArrayExcept(DEFAULT_BACKGROUNDS_LIGHT_MODE, prevBackgroundLightMode)
			const backgroundDarkModeNew = isBackgroundEnabled ? undefined : getRandomElementOfArrayExcept(DEFAULT_BACKGROUNDS_DARK_MODE, prevBackgroundDarkMode)

			dispatch(setBackgroundLightMode(backgroundLightModeNew))
			dispatch(setBackgroundDarkMode(backgroundDarkModeNew))

			dispatch(saveBackgroundLightMode({ backgroundLightMode: backgroundLightModeNew, userSettings }))
			dispatch(saveBackgroundDarkMode({ backgroundDarkMode: backgroundDarkModeNew, userSettings }))

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

function getRandomElementOfArrayExcept(array, exceptElement) {
	const newElement = getRandomElementOfArray(array)
	if (newElement === exceptElement) {
		return getRandomElementOfArrayExcept(array, exceptElement)
	}
	return newElement
}