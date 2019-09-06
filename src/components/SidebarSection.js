import React from 'react'
import PropTypes from 'prop-types'

import './SidebarSection.css'

export default function SidebarSection({ title, children }) {
	return (
		<section className="sidebar-section">
			<h1 className="sidebar-section__title">
				{title}
			</h1>
			{children}
		</section>
	)
}

SidebarSection.propTypes = {
	title: PropTypes.string.isRequired,
	children: PropTypes.node.isRequired
}