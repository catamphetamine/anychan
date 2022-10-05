import React from 'react'

import SidebarProviderLogo from './SidebarProviderLogo.js'

import SettingsLink from './SettingsLink.js'
import DarkModeToggle from './DarkModeToggle.js'

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