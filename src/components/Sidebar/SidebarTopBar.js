import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import './SidebarTopBar.css'

export default function SidebarTopBar({
	alignContent,
	children
}) {
	return (
		<div className={classNames('SidebarTopBar', {
			'SidebarTopBar--alignContentEnd': alignContent === 'end'
		})}>
			{children}
		</div>
	)
}

SidebarTopBar.propTypes = {
	alignContent: PropTypes.oneOf(['end']),
	children: PropTypes.node.isRequired
}