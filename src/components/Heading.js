import React from 'react'
import PropTypes from 'prop-types'

import './Heading.css'

export default function Heading({ children, ...rest }) {
	return (
		<h1 {...rest} className="Heading">
			{children}
		</h1>
	)
}

Heading.propTypes = {
	children: PropTypes.node.isRequired
}