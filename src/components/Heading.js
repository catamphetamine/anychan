import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import useBackground from '../hooks/useBackground.js'

import './Heading.css'

export default function Heading({
	onBackground,
	children,
	...rest
}) {
	const background = useBackground()

	return (
		<h1 {...rest} className={classNames('Heading', {
			'Heading--onBackground': onBackground && background
		})}>
			<span className="Heading-content">
				{children}
			</span>
		</h1>
	)
}

Heading.propTypes = {
	onBackground: PropTypes.bool,
	children: PropTypes.node.isRequired
}