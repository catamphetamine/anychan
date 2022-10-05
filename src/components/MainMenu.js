import React from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import classNames from 'classnames'

import Menu from 'frontend-lib/components/Menu.js'

import { areCookiesAccepted } from 'frontend-lib/utility/cookiePolicy.js'
import { notify } from '../redux/notifications.js'
import autoDarkMode from 'frontend-lib/utility/style/autoDarkMode.js'
import applyDarkMode from 'frontend-lib/utility/style/applyDarkMode.js'

import {
	showSidebar,
	setSidebarMode,
	setDarkMode
} from '../redux/app.js'

import { saveDarkMode } from '../redux/settings.js'

import useMessages from '../hooks/useMessages.js'

import FeedIconOutline from 'frontend-lib/icons/fill-and-outline/feed-outline.svg'
import FeedIconFill from 'frontend-lib/icons/fill-and-outline/feed-fill.svg'

import SettingsIconOutline from 'frontend-lib/icons/fill-and-outline/settings-outline.svg'
import SettingsIconFill from 'frontend-lib/icons/fill-and-outline/settings-fill.svg'

import MoonIconOutline from 'frontend-lib/icons/fill-and-outline/moon-outline.svg'
import MoonIconFill from 'frontend-lib/icons/fill-and-outline/moon-fill.svg'

// import BellIconOutline from 'frontend-lib/icons/fill-and-outline/bell-outline.svg'
// import BellIconFill from 'frontend-lib/icons/fill-and-outline/bell-fill.svg'

// import StarIconOutline from 'frontend-lib/icons/fill-and-outline/star-outline.svg'
// import StarIconFill from 'frontend-lib/icons/fill-and-outline/star-fill.svg'

// import ChannelIconOutline from '../../assets/images/icons/fill-and-outline/channel-outline.svg'
// import ChannelIconFill from '../../assets/images/icons/fill-and-outline/channel-fill.svg'

import MenuIconOutline from 'frontend-lib/icons/fill-and-outline/menu-outline.svg'
import MenuIconFill from 'frontend-lib/icons/fill-and-outline/menu-fill.svg'

export default function MainMenu({
	footer
}) {
	const dispatch = useDispatch()
	const messages = useMessages()

	const isSidebarShown = useSelector(state => state.app.isSidebarShown)
	const sidebarMode = useSelector(state => state.app.sidebarMode)
	const darkMode = useSelector(state => state.app.darkMode)
	const areSubscribedThreadsShown = useSelector(state => state.app.areSubscribedThreadsShown)
	const areNotificationsShown = useSelector(state => state.app.areNotificationsShown)

	function getMenuItems() {
		const areChannelsShown = sidebarMode === 'channels' && (footer ? isSidebarShown : true)
		const areSubscribedThreadsShown = sidebarMode === 'thread-subscriptions' && (footer ? isSidebarShown : true)
		const areNotificationsShown = sidebarMode === 'notifications' && (footer ? isSidebarShown : true)

		const settingsItem = getSettingsMenuItem({ messages })
		settingsItem.isSelected = !isSidebarShown

		const darkModeItem = getDarkModeMenuItem({ messages, dispatch, darkMode })

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

		// const subscribedThreadsItem = {
		// 	title: messages.subscribedThreads.title,
		// 	onClick() {
		// 		if (footer) {
		// 			if (areSubscribedThreadsShown) {
		// 				dispatch(showSidebar(false))
		// 			} else {
		// 				dispatch(showSidebar(true))
		// 				dispatch(setSidebarMode('thread-subscriptions'))
		// 			}
		// 		} else {
		// 			dispatch(setSidebarMode(areSubscribedThreadsShown ? 'channels' : 'thread-subscriptions'))
		// 		}
		// 	},
		// 	isSelected: areSubscribedThreadsShown,
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
				// subscribedThreadsItem,
				// notificationsItem
			]
		}

		// Desktop menu is optimized for left-to-right mouse navigation.
		return [
			darkModeItem,
			// subscribedThreadsItem,
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
	// isSidebarShown: PropTypes.bool,
	// darkMode: PropTypes.bool,
	// areSubscribedThreadsShown: PropTypes.bool,
	// areNotificationsShown: PropTypes.bool,
	// dispatch: PropTypes.func.isRequired
}

export function getDarkModeMenuItem({ messages, dispatch, darkMode }) {
	return {
		title: messages.darkMode,
		onClick: () => {
			if (!areCookiesAccepted()) {
				return dispatch(notify(messages.cookies.required))
			}
			dispatch(setDarkMode(!darkMode))
			dispatch(saveDarkMode(!darkMode))
			autoDarkMode(false, {
				setDarkMode: (value) => dispatch(applyDarkMode(value))
			})
		},
		isSelected: darkMode,
		icon: MoonIconOutline,
		iconActive: MoonIconFill
	}
}

export function getSettingsMenuItem({ messages }) {
	return {
		title: messages.settings.title,
		pathname: '/settings',
		url: '/settings',
		icon: SettingsIconOutline,
		iconActive: SettingsIconFill
	}
}