import React from 'react'

import SidebarProviderLogo from './SidebarProviderLogo.js'

import SettingsLink from './SettingsLink.js'
import DarkModeToggle from './DarkModeToggle.js'

import './SidebarProviderInfo.css'

export default function SidebarProviderInfo() {
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