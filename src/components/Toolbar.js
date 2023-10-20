import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Link } from 'react-pages'

import Menu from 'frontend-lib/components/Menu.js'

import './Toolbar.css'

export default function Toolbar({
	items,
	className,
	...rest
}) {
	return (
		<Menu
			{...rest}
			Link={Link}
			className={classNames('Toolbar', className)}>
			{items}
		</Menu>
	)
}

Toolbar.propTypes = {
	items: PropTypes.arrayOf(PropTypes.shape({
		title: PropTypes.string,
		onClick: PropTypes.func,
		isSelected: PropTypes.bool,
		icon: PropTypes.elementType,
		iconSelected: PropTypes.elementType,
		animate: PropTypes.oneOf(['pop']),
		type: PropTypes.oneOf(['separator']),
		size: PropTypes.oneOf(['s']),
		wait: PropTypes.bool,
		className: PropTypes.string
	})).isRequired,
	className: PropTypes.string
}