import React from 'react'
import PropTypes from 'prop-types'

import SimpleBar from 'simplebar-react'

export default function ScrollableContainer({
	style,
	maxHeight,
	children
}) {
	return (
		<SimpleBar style={style}>
			{children}
		</SimpleBar>
	)
}

ScrollableContainer.propTypes = {
	style: PropTypes.object,
	maxHeight: PropTypes.number,
	children: PropTypes.node.isRequired
}