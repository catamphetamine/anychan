import React from 'react'
import PropTypes from 'prop-types'

import './InfoBanner.css'

export default function InfoBanner({
	Icon,
	children
}) {
	return (
		<div className="InfoBanner">
			<Icon className="InfoBanner-icon"/>
			<p className="InfoBanner-text">
				{children}
			</p>
		</div>
	)
}

InfoBanner.propTypes = {
	Icon: PropTypes.elementType.isRequired,
	children: PropTypes.node.isRequired
}