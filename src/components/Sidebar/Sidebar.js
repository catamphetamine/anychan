import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { useSelector } from 'react-redux'

import SimpleBar from 'simplebar-react'

import HomePageLink from './HomePageLink.js'
import SettingsLink from './SettingsLink.js'
import DarkModeToggle from './DarkModeToggle.js'

import SidebarProvider from './SidebarProvider.js'
import SidebarMenuSection from './SidebarMenuSection.js'
import ChannelsSidebarSection from './ChannelsSidebarSection.js'
import FavoriteChannelsSidebarSection from './FavoriteChannelsSidebarSection.js'
import SubscribedThreadsSidebarSection from './SubscribedThreadsSidebarSection.js'

import useMessages from '../../hooks/useMessages.js'

import './Sidebar.css'

export default function Sidebar() {
	const messages = useMessages()

	const isSidebarShown = useSelector(state => state.app.isSidebarShown)

	return (
		<section className={classNames('Sidebar', {
			'Sidebar--show': isSidebarShown
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
				<SubscribedThreadsSidebarSection/>
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