import React from 'react'

// import HomePageLink from '../SidebarToolbar/HomePageLink.js'
import SettingsLink from '../SidebarToolbar/SettingsLink.js'
import DarkModeToggle from '../SidebarToolbar/DarkModeToggle.js'
import ColorfulBackgroundToggle from '../SidebarToolbar/ColorfulBackgroundToggle.js'
import UserAccountLink from '../SidebarToolbar/UserAccountLink.js'

import SidebarTopBar from '../Sidebar/SidebarTopBar.js'

import SidebarDataSourceLogoAndToolbar from '../Sidebar/SidebarDataSourceLogoAndToolbar.js'

import useDataSource from '../../hooks/useDataSource.js'

import './DataSourceLogoAndToolbarSidebarSection.css'

export default function DataSourceLogoAndToolbarSidebarSection() {
	const dataSource = useDataSource()

	const toolbarElements = (
		<>
			<DarkModeToggle/>
			<ColorfulBackgroundToggle/>
			<SettingsLink/>
			{dataSource && dataSource.supportsLogIn() &&
				<UserAccountLink/>
			}
		</>
	)

	return (
		<div className="DataSourceLogoAndToolbarSidebarSection">
			<SidebarDataSourceLogoAndToolbar
				toolbarElements={toolbarElements}
			/>
			<SidebarTopBar alignContent="end">
				{toolbarElements}
			</SidebarTopBar>
		</div>
	)
}