import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { useSelector } from 'react-redux'

import Sidebar from '../Sidebar/Sidebar.js'
import SidebarTopBar from '../Sidebar/SidebarTopBar.js'

import HomePageLink from './HomePageLink.js'
import SettingsLink from './SettingsLink.js'
import DarkModeToggle from './DarkModeToggle.js'

import SidebarProviderInfo from './SidebarProviderInfo.js'
// import SidebarMenuSection from './SidebarMenuSection.js'
import ChannelsSidebarSection from './ChannelsSidebarSection.js'
import FavoriteChannelsSidebarSection from './FavoriteChannelsSidebarSection.js'
import SubscribedThreadsSidebarSection from './SubscribedThreadsSidebarSection.js'

import './SidebarRight.css'

export default function SidebarRight() {
	const isSidebarShown = useSelector(state => state.app.isSidebarShown)

	return (
		<Sidebar className={classNames('SidebarRight', {
			'Sidebar--show': isSidebarShown
		})}>
			<SidebarProviderInfo/>
			<SidebarTopBar alignContent="end">
				{/*<div className="SidebarTopBar-right">*/}
					<DarkModeToggle/>
					<SettingsLink/>
					{/*<HomePageLink/>*/}
				{/*</div>*/}
			</SidebarTopBar>
			{/*<SidebarMenuSection/>*/}
			<SubscribedThreadsSidebarSection/>
			<FavoriteChannelsSidebarSection/>
			<ChannelsSidebarSection/>
		</Sidebar>
	)
}