import type { Messages } from '@/types'
import type { useUpdateSetting } from '@/hooks'

import { areCookiesAccepted } from 'frontend-lib/utility/cookiePolicy.js'

import { notify } from '../../redux/notifications.js'
import { setBackgroundLightMode, setBackgroundDarkMode } from '../../redux/app.js'

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
	updateSetting
}: {
	messages: Messages,
	dispatch: Dispatch,
	measure: () => void,
	backgroundLightMode?: string,
	backgroundDarkMode?: string,
	prevBackgroundLightMode?: string,
	prevBackgroundDarkMode?: string,
	setPrevBackgroundLightMode?: (value?: string) => void,
	setPrevBackgroundDarkMode?: (value?: string) => void,
	updateSetting: ReturnType<typeof useUpdateSetting>
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

			updateSetting('backgroundLightMode', backgroundLightModeNew)
			updateSetting('backgroundDarkMode', backgroundDarkModeNew)

			measure()
		},
		isSelected: isBackgroundEnabled,
		icon: DogeColorfulGlassesIconOutline,
		iconSelected: DogeColorfulGlassesIconFill
	}
}

function getRandomElementOfArray(array: any[]) {
	return array[Math.floor(Math.random() * array.length)]
}

function getRandomElementOfArrayExcept(array: any[], exceptElement: any) {
	const newElement = getRandomElementOfArray(array)
	if (newElement === exceptElement) {
		return getRandomElementOfArrayExcept(array, exceptElement)
	}
	return newElement
}