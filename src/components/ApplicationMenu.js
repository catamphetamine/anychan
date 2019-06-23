import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Menu from './Menu'

import {
	toggleSidebar,
	toggleNightMode,
	toggleTrackedThreads,
	toggleNotifications
} from '../redux/app'

import getMessages from '../messages'

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

@connect(({ app, found }) => ({
	locale: app.settings.locale,
	isSidebarShown: app.isSidebarShown,
	isNightMode: app.isNightMode,
	areTrackedThreadsShown: app.areTrackedThreadsShown,
	areNotificationsShown: app.areNotificationsShown,
	location: found.resolvedMatch.location
}), {
	toggleSidebar,
	toggleNightMode,
	toggleTrackedThreads,
	toggleNotifications
})
export default class ApplicationMenu extends React.Component {
	static propTypes = {
		footer: PropTypes.bool,
		locale: PropTypes.string.isRequired,
		location: PropTypes.object.isRequired,
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
			toggleNotifications
		} = this.props
		const messages = getMessages(locale)
		let menuItems = [
			{
				title: messages.nightMode.title,
				action: toggleNightMode,
				isActive: isNightMode,
				outlineIcon: MoonIconOutline,
				fillIcon: MoonIconFill
			},
			{
				title: messages.trackedThreads.title,
				action: toggleTrackedThreads,
				isActive: areTrackedThreadsShown,
				outlineIcon: StarIconOutline,
				fillIcon: StarIconFill
			},
			{
				title: messages.notifications.title,
				action: toggleNotifications,
				isActive: areNotificationsShown,
				outlineIcon: BellIconOutline,
				fillIcon: BellIconFill
			},
			{
				link: '/settings',
				isActive: !isSidebarShown && location.pathname === '/settings',
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