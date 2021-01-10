import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { useSelector } from 'react-redux'

import SimpleBar from 'simplebar-react'

import HomePageLink from './HomePageLink'
import SettingsLink from './SettingsLink'
import DarkModeToggle from './DarkModeToggle'

import SidebarProvider from './SidebarProvider'
import SidebarMenuSection from './SidebarMenuSection'
import ChannelsSidebarSection from './ChannelsSidebarSection'
import FavoriteChannelsSidebarSection from './FavoriteChannelsSidebarSection'
import TrackedThreadsSidebarSection from './TrackedThreadsSidebarSection'

import getMessages from '../../messages'

import './Sidebar.css'

export default function Sidebar() {
	const locale = useSelector(({ settings }) => settings.settings.locale)
	const isShown = useSelector(({ app }) => app.isSidebarShown)
	// const mode = useSelector(({ app }) => app.sidebarMode)
	return (
		<section className={classNames('Sidebar', {
			'Sidebar--show': isShown
		})}>
			<SimpleBar className="Sidebar-scrollableList">
				<SidebarProvider/>
				<div className="Sidebar-topBar">
					{/*<div className="Sidebar-topBarRight">*/}
						<DarkModeToggle/>
						<SettingsLink/>
						{/*<HomePageLink/>*/}
					{/*</div>*/}
				</div>
				{/*<SidebarMenuSection/>*/}
				<TrackedThreadsSidebarSection/>
				<FavoriteChannelsSidebarSection/>
				<ChannelsSidebarSection/>
			</SimpleBar>
		</section>
	)
}

Sidebar.propTypes = {
	// isShown: PropTypes.bool,
	// locale: PropTypes.string.isRequired,
	// mode: PropTypes.string.isRequired
}