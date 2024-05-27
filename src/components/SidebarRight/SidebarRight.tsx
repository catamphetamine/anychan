import React from 'react'
import classNames from 'classnames'

import { useSelector } from '@/hooks'

import Sidebar from '../Sidebar/Sidebar.js'

import AvailableChannelsSidebarSection from '../SidebarSections/AvailableChannelsSidebarSection.js'
import FavoriteChannelsSidebarSection from '../SidebarSections/FavoriteChannelsSidebarSection.js'
import SubscribedThreadsSidebarSection from '../SidebarSections/SubscribedThreadsSidebarSection.js'
import DataSourceLogoAndToolbarSidebarSection from '../SidebarSections/DataSourceLogoAndToolbarSidebarSection.js'
import DataSourcesSidebarSection from '../SidebarSections/DataSourcesSidebarSection.js'

import './SidebarRight.css'

export default function SidebarRight() {
	// On small screens, users are able to toggle show/hide of the expandable sidebar.
	const isSidebarShown = useSelector(state => state.app.isSidebarShown)

	return (
		<Sidebar className={classNames('SidebarRight', {
			'Sidebar--show': isSidebarShown
		})}>
			<DataSourceLogoAndToolbarSidebarSection/>
			<SubscribedThreadsSidebarSection/>
			<FavoriteChannelsSidebarSection/>
			<AvailableChannelsSidebarSection/>
			<DataSourcesSidebarSection/>
		</Sidebar>
	)
}