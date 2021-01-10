import React from 'react'

import SidebarProviderLogo from './SidebarProviderLogo'

import SettingsLink from './SettingsLink'
import DarkModeToggle from './DarkModeToggle'

import './SidebarProvider.css'

export default function SidebarProvider() {
	return (
		<div className="Sidebar-provider">
			<SidebarProviderLogo/>
			<div className="Sidebar-applicationMenu">
				<DarkModeToggle/>
				<SettingsLink/>
			</div>
		</div>
	)
}