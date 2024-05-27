import React, { ReactNode } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import './SidebarTopBar.css'

export default function SidebarTopBar({
	alignContent,
	children
}: SidebarTopBarProps) {
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

interface SidebarTopBarProps {
	alignContent?: 'end',
	children: ReactNode
}