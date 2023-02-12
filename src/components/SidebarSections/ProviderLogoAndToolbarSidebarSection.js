import React from 'react'

// import HomePageLink from '../SidebarToolbar/HomePageLink.js'
import SettingsLink from '../SidebarToolbar/SettingsLink.js'
import DarkModeToggle from '../SidebarToolbar/DarkModeToggle.js'

import SidebarTopBar from '../Sidebar/SidebarTopBar.js'

import SidebarProviderLogoAndToolbar from '../Sidebar/SidebarProviderLogoAndToolbar.js'

import './ProviderLogoAndToolbarSidebarSection.css'

export default function ProviderLogoAndToolbarSidebarSection() {
	const toolbarElements = (
		<>
			<DarkModeToggle/>
			<SettingsLink/>
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