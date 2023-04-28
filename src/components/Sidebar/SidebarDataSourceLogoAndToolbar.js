import React from 'react'
import PropTypes from 'prop-types'

import SidebarDataSourceLogo from './SidebarDataSourceLogo.js'

import './SidebarDataSourceLogoAndToolbar.css'

export default function SidebarDataSourceLogoAndToolbar({
	toolbarElements
}) {
	return (
		<div className="SidebarDataSourceLogoAndToolbar">
			<SidebarDataSourceLogo/>
			<div className="SidebarDataSourceLogoAndToolbar-toolbar">
				{toolbarElements}
			</div>
		</div>
	)
}

SidebarDataSourceLogoAndToolbar.propTypes = {
	toolbarElements: PropTypes.node.isRequired
}