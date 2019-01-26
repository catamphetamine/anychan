import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-website'
import classNames from 'classnames'

import './Menu.css'

export default class Menu extends React.Component
{
	render()
	{
		const {
			className,
			children
		} = this.props

		return (
			<ul className={classNames('menu', className)}>
				{children.map(({ link, selected, outlineIcon, fillIcon }) => (
					<MenuLink to={link} key={link}>
						{React.createElement(selected ? fillIcon : outlineIcon, { className: 'menu-item__icon' })}
					</MenuLink>
				))}
			</ul>
		)
	}
}

Menu.propTypes = {
	children: PropTypes.arrayOf(PropTypes.shape({
		link: PropTypes.string.isRequired,
		selected: PropTypes.bool,
		outlineIcon: PropTypes.func.isRequired,
		fillIcon: PropTypes.func.isRequired
	}))
}

export function MenuLink({ to, selected, children })
{
	// Menu items are not implemented.
	// Stub with main page links.
	to = '/'
	return (
		<li className="menu-list-item">
			<Link
				to={to}
				activeClassName="menu-item--selected"
				className={classNames('menu-item', {
					'menu-item--selected': selected
				})}>
				{children}
			</Link>
		</li>
	)
}

MenuLink.propTypes = {
	to: PropTypes.string.isRequired,
	selected: PropTypes.bool,
	children: PropTypes.node.isRequired
}