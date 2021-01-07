import React from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import classNames from 'classnames'

import Menu from 'webapp-frontend/src/components/Menu'
import { areCookiesAccepted } from 'webapp-frontend/src/utility/cookiePolicy'
import { notify } from 'webapp-frontend/src/redux/notifications'
import { autoDarkMode } from 'webapp-frontend/src/utility/style'

import {
	showSidebar,
	setSidebarMode,
	setDarkMode
} from '../redux/app'

import { saveDarkMode } from '../redux/settings'

import getMessages from '../messages'

import FeedIconOutline from 'webapp-frontend/assets/images/icons/menu/feed-outline.svg'
import FeedIconFill from 'webapp-frontend/assets/images/icons/menu/feed-fill.svg'

import SettingsIconOutline from 'webapp-frontend/assets/images/icons/menu/settings-outline.svg'
import SettingsIconFill from 'webapp-frontend/assets/images/icons/menu/settings-fill.svg'

import MoonIconOutline from 'webapp-frontend/assets/images/icons/menu/moon-outline.svg'
import MoonIconFill from 'webapp-frontend/assets/images/icons/menu/moon-fill.svg'

// import BellIconOutline from 'webapp-frontend/assets/images/icons/menu/bell-outline.svg'
// import BellIconFill from 'webapp-frontend/assets/images/icons/menu/bell-fill.svg'

// import StarIconOutline from 'webapp-frontend/assets/images/icons/menu/star-outline.svg'
// import StarIconFill from 'webapp-frontend/assets/images/icons/menu/star-fill.svg'

// import ChannelIconOutline from '../../assets/images/icons/menu/channel-outline.svg'
// import ChannelIconFill from '../../assets/images/icons/menu/channel-fill.svg'

import MenuIconOutline from 'webapp-frontend/assets/images/icons/menu/menu-outline.svg'
import MenuIconFill from 'webapp-frontend/assets/images/icons/menu/menu-fill.svg'

export default function MainMenu({
	footer
}) {
	const dispatch = useDispatch()
	const locale = useSelector(({ settings }) => settings.settings.locale)
	const isSidebarShown = useSelector(({ app }) => app.isSidebarShown)
	const sidebarMode = useSelector(({ app }) => app.sidebarMode)
	const darkMode = useSelector(({ app }) => app.darkMode)
	const areTrackedThreadsShown = useSelector(({ app }) => app.areTrackedThreadsShown)
	const areNotificationsShown = useSelector(({ app }) => app.areNotificationsShown)

	function getMenuItems() {
		const messages = getMessages(locale)
		const areChannelsShown = sidebarMode === 'channels' && (footer ? isSidebarShown : true)
		const areTrackedThreadsShown = sidebarMode === 'tracked-threads' && (footer ? isSidebarShown : true)
		const areNotificationsShown = sidebarMode === 'notifications' && (footer ? isSidebarShown : true)
		const settingsItem = getSettingsMenuItem()
		settingsItem.isSelected = !isSidebarShown
		const darkModeItem = getDarkModeMenuItem({ locale, dispatch, darkMode })
		const menuItem = {
			title: messages.menu,
			onClick() {
				if (isSidebarShown) {
					dispatch(showSidebar(false))
				} else {
					dispatch(showSidebar(true))
				}
			},
			isSelected: isSidebarShown,
			icon: MenuIconOutline,
			iconActive: MenuIconFill
		}
		// const channelsItem = {
		// 	title: messages.boards.title,
		// 	onClick() {
		// 		if (footer) {
		// 			if (areChannelsShown) {
		// 				dispatch(showSidebar(false))
		// 			} else {
		// 				dispatch(showSidebar(true))
		// 				dispatch(setSidebarMode('channels'))
		// 			}
		// 		}
		// 	},
		// 	isSelected: footer ? areChannelsShown : undefined,
		// 	icon: ChannelIconOutline,
		// 	iconActive: ChannelIconFill,
		// 	size: 'xxl'
		// }
		// const trackedThreadsItem = {
		// 	title: messages.trackedThreads.title,
		// 	onClick() {
		// 		if (footer) {
		// 			if (areTrackedThreadsShown) {
		// 				dispatch(showSidebar(false))
		// 			} else {
		// 				dispatch(showSidebar(true))
		// 				dispatch(setSidebarMode('tracked-threads'))
		// 			}
		// 		} else {
		// 			dispatch(setSidebarMode(areTrackedThreadsShown ? 'channels' : 'tracked-threads'))
		// 		}
		// 	},
		// 	isSelected: areTrackedThreadsShown,
		// 	icon: StarIconOutline,
		// 	iconActive: StarIconFill
		// }
		// const notificationsItem = {
		// 	title: messages.notifications.title,
		// 	onClick() {
		// 		if (footer) {
		// 			if (areNotificationsShown) {
		// 				dispatch(showSidebar(false))
		// 			} else {
		// 				dispatch(showSidebar(true))
		// 				dispatch(setSidebarMode('notifications'))
		// 			}
		// 		} else {
		// 			dispatch(setSidebarMode(areNotificationsShown ? 'channels' : 'notifications'))
		// 		}
		// 	},
		// 	isSelected: areNotificationsShown,
		// 	icon: BellIconOutline,
		// 	iconActive: BellIconFill
		// }
		// Mobile menu is optimized for holding the phone in the right hand.
		if (footer) {
			return [
				darkModeItem,
				menuItem,
				settingsItem
				// channelsItem,
				// trackedThreadsItem,
				// notificationsItem
			]
		}
		// Desktop menu is optimized for left-to-right mouse navigation.
		return [
			darkModeItem,
			// trackedThreadsItem,
			// notificationsItem,
			// channelsItem,
			settingsItem
		]
	}

	return (
		<Menu className={classNames('MainMenu', footer && 'rrui__fixed-full-width')}>
			{getMenuItems()}
		</Menu>
	)
}

MainMenu.propTypes = {
	footer: PropTypes.bool,
	// locale: PropTypes.string.isRequired,
	// isSidebarShown: PropTypes.bool,
	// darkMode: PropTypes.bool,
	// areTrackedThreadsShown: PropTypes.bool,
	// areNotificationsShown: PropTypes.bool,
	// dispatch: PropTypes.func.isRequired
}

export function getDarkModeMenuItem({ locale, dispatch, darkMode }) {
	const messages = getMessages(locale)
	return {
		title: messages.darkMode,
		onClick: () => {
			if (!areCookiesAccepted()) {
				return dispatch(notify(messages.cookies.required))
			}
			dispatch(setDarkMode(!darkMode))
			dispatch(saveDarkMode(!darkMode))
			autoDarkMode(false)
		},
		isSelected: darkMode,
		icon: MoonIconOutline,
		iconActive: MoonIconFill
	}
}

export function getSettingsMenuItem() {
	return {
		pathname: '/settings',
		url: '/settings',
		icon: SettingsIconOutline,
		iconActive: SettingsIconFill
	}
}