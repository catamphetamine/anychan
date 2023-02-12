import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { useSelector } from 'react-redux'

import Sidebar from '../Sidebar/Sidebar.js'
import SidebarTopBar from '../Sidebar/SidebarTopBar.js'

import AvailableChannelsSidebarSection from '../SidebarSections/AvailableChannelsSidebarSection.js'
import FavoriteChannelsSidebarSection from '../SidebarSections/FavoriteChannelsSidebarSection.js'
import SubscribedThreadsSidebarSection from '../SidebarSections/SubscribedThreadsSidebarSection.js'
import ProviderLogoAndToolbarSidebarSection from '../SidebarSections/ProviderLogoAndToolbarSidebarSection.js'

import './SidebarRight.css'

export default function SidebarRight() {
	// On small screens, users are able to toggle show/hide of the expandable sidebar.
	const isSidebarShown = useSelector(state => state.app.isSidebarShown)

	return (
		<Sidebar className={classNames('SidebarRight', {
			'Sidebar--show': isSidebarShown
		})}>
			<ProviderLogoAndToolbarSidebarSection/>
			<SubscribedThreadsSidebarSection/>
			<FavoriteChannelsSidebarSection/>
			<AvailableChannelsSidebarSection/>
		</Sidebar>
	)
}