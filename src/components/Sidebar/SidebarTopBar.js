import React from 'react'
import PropTypes from 'prop-types'

import './SidebarTopBar.css'

export default function SidebarTopBar({ children }) {
	return (
		<div className="SidebarTopBar">
			{children}
		</div>
	)
}

SidebarTopBar.propTypes = {
	children: PropTypes.node.isRequired
}