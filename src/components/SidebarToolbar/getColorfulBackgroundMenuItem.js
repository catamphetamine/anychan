import { areCookiesAccepted } from 'frontend-lib/utility/cookiePolicy.js'

import { notify } from '../../redux/notifications.js'
import { setColorfulBackground } from '../../redux/app.js'
import { saveColorfulBackground } from '../../redux/settings.js'

import DogeColorfulGlassesIconOutline from '../../../assets/images/icons/menu/doge-colorful-glasses-outline.svg'
import DogeColorfulGlassesIconFill from '../../../assets/images/icons/menu/doge-colorful-glasses-fill.svg'

export default function getColorfulBackgroundMenuItem({
	messages,
	dispatch,
	measure,
	colorfulBackground,
	userSettings
}) {
	return {
		title: messages.colorfulBackground,
		onClick: () => {
			if (!areCookiesAccepted()) {
				return dispatch(notify(messages.cookies.required))
			}
			dispatch(setColorfulBackground(!colorfulBackground))
			dispatch(saveColorfulBackground({ colorfulBackground: !colorfulBackground, userSettings }))
			measure()
		},
		isSelected: colorfulBackground,
		icon: DogeColorfulGlassesIconOutline,
		iconSelected: DogeColorfulGlassesIconFill
	}
}
