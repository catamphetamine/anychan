import React, { ReactNode } from 'react'
import PropTypes from 'prop-types'

import './FullWidthContent.css'

/**
 * Should be placed inside `.Webpage` element.
 * Would also require setting `z-index: 1` on `<Sidebar/>`.
 */
export default function FullWidthContent({ children }: FullWidthContentProps) {
	return (
		<div className="FullWidthContent">
			<div className="FullWidthContent-paddedContent">
				{children}
				<div className="FullWidthContent-stretchContent"/>
			</div>
			<div className="FullWidthContent-sidebar"/>
		</div>
	)
}

FullWidthContent.propTypes = {
	children: PropTypes.node
}

interface FullWidthContentProps {
	children: ReactNode
}