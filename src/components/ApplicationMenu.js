import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classNames from 'classnames'

import Menu from 'webapp-frontend/src/components/Menu'
import { areCookiesAccepted } from 'webapp-frontend/src/utility/cookiePolicy'
import { notify } from 'webapp-frontend/src/redux/notifications'

import {
	showSidebar,
	setSidebarMode,
	toggleDarkMode
} from '../redux/app'

import getMessages from '../messages'
import { addChanParameter } from '../chan'
import { applyDarkMode } from 'webapp-frontend/src/utility/style'

import FeedIconOutline from 'webapp-frontend/assets/images/icons/menu/feed-outline.svg'
import FeedIconFill from 'webapp-frontend/assets/images/icons/menu/feed-fill.svg'

import SettingsIconOutline from 'webapp-frontend/assets/images/icons/menu/settings-outline.svg'
import SettingsIconFill from 'webapp-frontend/assets/images/icons/menu/settings-fill.svg'

import MoonIconOutline from 'webapp-frontend/assets/images/icons/menu/moon-outline.svg'
import MoonIconFill from 'webapp-frontend/assets/images/icons/menu/moon-fill.svg'

import BellIconOutline from 'webapp-frontend/assets/images/icons/menu/bell-outline.svg'
import BellIconFill from 'webapp-frontend/assets/images/icons/menu/bell-fill.svg'

import StarIconOutline from 'webapp-frontend/assets/images/icons/menu/star-outline.svg'
import StarIconFill from 'webapp-frontend/assets/images/icons/menu/star-fill.svg'

import BoardIconOutline from '../../assets/images/icons/menu/board-outline.svg'
import BoardIconFill from '../../assets/images/icons/menu/board-fill.svg'

import './ApplicationMenu.css'

@connect(({ app }) => ({
	locale: app.settings.locale,
	isSidebarShown: app.isSidebarShown,
	sidebarMode: app.sidebarMode,
	darkMode: app.settings.darkMode,
	areTrackedThreadsShown: app.areTrackedThreadsShown,
	areNotificationsShown: app.areNotificationsShown
}), dispatch => ({ dispatch }))
export default class _ApplicationMenu extends React.Component {
	render() {
		return <ApplicationMenu {...this.props}/>
	}
}

function ApplicationMenu(props) {
	function getMenuItems() {
		const {
			footer,
			locale,
			isSidebarShown,
			sidebarMode,
			darkMode,
			dispatch
		} = props
		const messages = getMessages(locale)
		const areBoardsShown = sidebarMode === 'boards' && (footer ? isSidebarShown : true)
		const areTrackedThreadsShown = sidebarMode === 'tracked-threads' && (footer ? isSidebarShown : true)
		const areNotificationsShown = sidebarMode === 'notifications' && (footer ? isSidebarShown : true)
		const settingsItem = {
			url: addChanParameter('/settings'),
			isSelected: !isSidebarShown,
			icon: SettingsIconOutline,
			iconActive: SettingsIconFill
		}
		const darkModeItem = {
			title: messages.darkMode,
			onClick: () => {
				if (!areCookiesAccepted()) {
					return notify(messages.cookies.required)
				}
				dispatch(toggleDarkMode())
				applyDarkMode(!darkMode)
			},
			isSelected: darkMode,
			icon: MoonIconOutline,
			iconActive: MoonIconFill
		}
		const boardsItem = {
			title: messages.boards.title,
			onClick() {
				if (footer) {
					if (areBoardsShown) {
						dispatch(showSidebar(false))
					} else {
						dispatch(showSidebar(true))
						dispatch(setSidebarMode('boards'))
					}
				}
			},
			isSelected: footer ? areBoardsShown : undefined,
			icon: BoardIconOutline,
			iconActive: BoardIconFill,
			size: 'xxl'
		}
		const trackedThreadsItem = {
			title: messages.trackedThreads.title,
			onClick() {
				if (footer) {
					if (areTrackedThreadsShown) {
						dispatch(showSidebar(false))
					} else {
						dispatch(showSidebar(true))
						dispatch(setSidebarMode('tracked-threads'))
					}
				} else {
					dispatch(setSidebarMode(areTrackedThreadsShown ? 'boards' : 'tracked-threads'))
				}
			},
			isSelected: areTrackedThreadsShown,
			icon: StarIconOutline,
			iconActive: StarIconFill
		}
		const notificationsItem = {
			title: messages.notifications.title,
			onClick() {
				if (footer) {
					if (areNotificationsShown) {
						dispatch(showSidebar(false))
					} else {
						dispatch(showSidebar(true))
						dispatch(setSidebarMode('notifications'))
					}
				} else {
					dispatch(setSidebarMode(areNotificationsShown ? 'boards' : 'notifications'))
				}
			},
			isSelected: areNotificationsShown,
			icon: BellIconOutline,
			iconActive: BellIconFill
		}
		// Mobile menu is optimized for holding the phone in the right hand.
		if (footer) {
			return [
				settingsItem,
				darkModeItem,
				boardsItem,
				trackedThreadsItem,
				notificationsItem
			]
		}
		// Desktop menu is optimized for left-to-right mouse navigation.
		return [
			darkModeItem,
			trackedThreadsItem,
			notificationsItem,
			// boardsItem,
			settingsItem
		]
	}

	return (
		<Menu className={classNames('application-menu', props.footer && 'rrui__fixed-full-width')}>
			{getMenuItems()}
		</Menu>
	)
}

ApplicationMenu.propTypes = {
	footer: PropTypes.bool,
	locale: PropTypes.string.isRequired,
	isSidebarShown: PropTypes.bool,
	darkMode: PropTypes.bool,
	areTrackedThreadsShown: PropTypes.bool,
	areNotificationsShown: PropTypes.bool,
	dispatch: PropTypes.func.isRequired
}