import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Menu from 'webapp-frontend/src/components/Menu'

import { notify } from 'webapp-frontend/src/redux/notifications'

import {
	toggleSidebar,
	toggleNightMode,
	toggleTrackedThreads,
	toggleNotifications
} from '../redux/app'

import getMessages from '../messages'
import { addChanParameter } from '../chan'

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

import './ApplicationMenu.css'

@connect(({ app }) => ({
	locale: app.settings.locale,
	isSidebarShown: app.isSidebarShown,
	isNightMode: app.isNightMode,
	areTrackedThreadsShown: app.areTrackedThreadsShown,
	areNotificationsShown: app.areNotificationsShown
}), {
	toggleSidebar,
	toggleNightMode,
	toggleTrackedThreads,
	toggleNotifications,
	notify
})
export default class ApplicationMenu extends React.Component {
	static propTypes = {
		footer: PropTypes.bool,
		locale: PropTypes.string.isRequired,
		isSidebarShown: PropTypes.bool,
		isNightMode: PropTypes.bool,
		areTrackedThreadsShown: PropTypes.bool,
		areNotificationsShown: PropTypes.bool,
		toggleSidebar: PropTypes.func.isRequired,
		toggleNightMode: PropTypes.func.isRequired,
		toggleTrackedThreads: PropTypes.func.isRequired,
		toggleNotifications: PropTypes.func.isRequired
	}

	getMenuItems() {
		const {
			footer,
			locale,
			isSidebarShown,
			isNightMode,
			areTrackedThreadsShown,
			areNotificationsShown,
			toggleSidebar,
			toggleNightMode,
			toggleTrackedThreads,
			toggleNotifications,
			notify
		} = this.props
		const messages = getMessages(locale)
		let menuItems = [
			{
				title: messages.nightMode.title,
				action: () => notify('Not implemented yet'), // toggleNightMode,
				isActive: isNightMode,
				outlineIcon: MoonIconOutline,
				fillIcon: MoonIconFill
			},
			{
				title: messages.trackedThreads.title,
				action: () => notify('Not implemented yet'), // toggleTrackedThreads,
				isActive: areTrackedThreadsShown,
				outlineIcon: StarIconOutline,
				fillIcon: StarIconFill
			},
			{
				title: messages.notifications.title,
				action: () => notify('Not implemented yet'), // toggleNotifications,
				isActive: areNotificationsShown,
				outlineIcon: BellIconOutline,
				fillIcon: BellIconFill
			},
			{
				url: addChanParameter('/settings'),
				isActive: !isSidebarShown,
				outlineIcon: SettingsIconOutline,
				fillIcon: SettingsIconFill
			}
		]
		if (footer) {
			menuItems = [{
				title: messages.boards.title,
				action: toggleSidebar,
				isActive: isSidebarShown,
				outlineIcon: FeedIconOutline,
				fillIcon: FeedIconFill
			}].concat(menuItems)
		}
		return menuItems
	}

	render() {
		return (
			<Menu className="application-menu">
				{this.getMenuItems()}
			</Menu>
		)
	}
}