import React from 'react'
import PropTypes from 'prop-types'

import SidebarProviderLogo from './SidebarProviderLogo.js'

import './SidebarProviderLogoAndToolbar.css'

export default function SidebarProviderLogoAndToolbar({
	toolbarElements
}) {
	return (
		<div className="SidebarProviderLogoAndToolbar">
			<SidebarProviderLogo/>
			<div className="SidebarProviderLogoAndToolbar-toolbar">
				{toolbarElements}
			</div>
		</div>
	)
}

SidebarProviderLogoAndToolbar.propTypes = {
	toolbarElements: PropTypes.node.isRequired
}