import React, { ReactNode } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import useBackground from '../hooks/useBackground.js'

import './Heading.css'

export default function Heading({
	onBackground,
	className,
	children,
	...rest
}: HeadingProps) {
	const background = useBackground()

	return (
		<h1 {...rest} className={classNames('Heading', className, {
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
	className: PropTypes.string,
	children: PropTypes.node.isRequired
}

interface HeadingProps {
	onBackground?: boolean,
	className?: string,
	children: ReactNode
}