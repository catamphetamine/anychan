import React from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import classNames from 'classnames'

import Menu from 'frontend-lib/components/Menu.js'

import useMessages from '../hooks/useMessages.js'
import useSettings from '../hooks/useSettings.js'
import useMeasure from '../hooks/useMeasure.js'
import useSource from '../hooks/useSource.js'

import FeedIconOutline from 'frontend-lib/icons/fill-and-outline/feed-outline.svg'
import FeedIconFill from 'frontend-lib/icons/fill-and-outline/feed-fill.svg'

import PersonIconOutline from 'frontend-lib/icons/fill-and-outline/person-outline.svg'
import PersonIconFill from 'frontend-lib/icons/fill-and-outline/person-fill.svg'

// import BellIconOutline from 'frontend-lib/icons/fill-and-outline/bell-outline.svg'
// import BellIconFill from 'frontend-lib/icons/fill-and-outline/bell-fill.svg'

// import StarIconOutline from 'frontend-lib/icons/fill-and-outline/star-outline.svg'
// import StarIconFill from 'frontend-lib/icons/fill-and-outline/star-fill.svg'

// import ChannelIconOutline from '../../assets/images/icons/fill-and-outline/channel-outline.svg'
// import ChannelIconFill from '../../assets/images/icons/fill-and-outline/channel-fill.svg'

import MenuIconOutline from 'frontend-lib/icons/fill-and-outline/menu-outline.svg'
import MenuIconFill from 'frontend-lib/icons/fill-and-outline/menu-fill.svg'

export default function MainMenu() {
	const dispatch = useDispatch()
	const messages = useMessages()
	const userSettings = useSettings()
	const measure = useMeasure()
	const source = useSource()

	const isSidebarShown = useSelector(state => state.app.isSidebarShown)
	const sidebarMode = useSelector(state => state.app.sidebarMode)
	const darkMode = useSelector(state => state.app.darkMode)
	const areSubscribedThreadsShown = useSelector(state => state.app.areSubscribedThreadsShown)
	const areNotificationsShown = useSelector(state => state.app.areNotificationsShown)

	function getMenuItems() {
		// A legacy version of the website used "footer" mode for the `<MainMenu/>`.
		const footer = false

		const areChannelsShown = sidebarMode === 'channels' && (footer ? isSidebarShown : true)
		const areSubscribedThreadsShown = sidebarMode === 'thread-subscriptions' && (footer ? isSidebarShown : true)
		const areNotificationsShown = sidebarMode === 'notifications' && (footer ? isSidebarShown : true)

		const settingsItem = getSettingsMenuItem({ messages })
		// Don't show the "fill" icon variant when a user has sidebar expanded
		// in a "mobile" version of a website, because those icons are shown
		// in the expanded sidebar and it doesn't look better with "fill" icon
		// variant there even if the respective menu item is selected.
		settingsItem.isSelected = !isSidebarShown

		const userAccountItem = getUserAccountMenuItem({ messages })
		// Don't show the "fill" icon variant when a user has sidebar expanded
		// in a "mobile" version of a website, because those icons are shown
		// in the expanded sidebar and it doesn't look better with "fill" icon
		// variant there even if the respective menu item is selected.
		userAccountItem.isSelected = !isSidebarShown

		const darkModeItem = getDarkModeMenuItem({ messages, dispatch, measure, darkMode, userSettings })

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

		let menuItems

		// Mobile menu is optimized for holding the phone in the right hand.
		if (footer) {
			menuItems = [
				darkModeItem,
				menuItem,
				settingsItem
				// channelsItem,
				// subscribedThreadsItem,
				// notificationsItem
			]
		} else {
			// Desktop menu is optimized for left-to-right mouse navigation.
			menuItems = [
				darkModeItem,
				// subscribedThreadsItem,
				// notificationsItem,
				// channelsItem,
				settingsItem
			]
		}

		if (source.api.logIn) {
			menuItems.push(userAccountItem)
		}

		return menuItems
	}

	return (
		<Menu className={classNames('MainMenu', footer && 'rrui__fixed-full-width')}>
			{getMenuItems()}
		</Menu>
	)
}

MainMenu.propTypes = {
	// footer: PropTypes.bool,
	// isSidebarShown: PropTypes.bool,
	// darkMode: PropTypes.bool,
	// areSubscribedThreadsShown: PropTypes.bool,
	// areNotificationsShown: PropTypes.bool,
	// dispatch: PropTypes.func.isRequired
}

export function getUserAccountMenuItem({ messages, dispatch, measure, darkMode, userSettings }) {
	return {
		title: messages.userAccount.title,
		pathname: '/user',
		url: '/user',
		icon: PersonIconOutline,
		iconActive: PersonIconFill
	}
}