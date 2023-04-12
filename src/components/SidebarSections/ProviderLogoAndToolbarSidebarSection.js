import React from 'react'

// import HomePageLink from '../SidebarToolbar/HomePageLink.js'
import SettingsLink from '../SidebarToolbar/SettingsLink.js'
import DarkModeToggle from '../SidebarToolbar/DarkModeToggle.js'
import UserAccountLink from '../SidebarToolbar/UserAccountLink.js'

import SidebarTopBar from '../Sidebar/SidebarTopBar.js'

import SidebarProviderLogoAndToolbar from '../Sidebar/SidebarProviderLogoAndToolbar.js'

import useSource from '../../hooks/useSource.js'

import './ProviderLogoAndToolbarSidebarSection.css'

export default function ProviderLogoAndToolbarSidebarSection() {
	const source = useSource()

	const toolbarElements = (
		<>
			<DarkModeToggle/>
			<SettingsLink/>
			{source.api.logIn &&
				<UserAccountLink/>
			}
		</>
	)

	return (
		<div className="ProviderLogoAndToolbarSidebarSection">
			<SidebarProviderLogoAndToolbar
				toolbarElements={toolbarElements}
			/>
			<SidebarTopBar alignContent="end">
				{toolbarElements}
			</SidebarTopBar>
		</div>
	)
}