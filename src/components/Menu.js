import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-website'
import classNames from 'classnames'

import { addChanParameter } from '../chan'
import getMessages from '../messages'

import './Menu.css'

@connect(({ account, found }) => ({
	locale: account.settings.locale,
	location: found.resolvedMatch.location
}))
export default class Menu extends React.Component {
	render() {
		const {
			locale,
			location,
			className,
			children
		} = this.props

		return (
			<ul className={classNames('menu', className)}>
				{children.map(({ link, title, outlineIcon, fillIcon }) => {
					const isSelected = location.pathname === link
					return (
						<MenuLink
							to={link}
							key={link}
							title={getMessages(locale)[title].title}>
							{React.createElement(
								isSelected ? fillIcon : outlineIcon,
								{ className: 'menu-item__icon' }
							)}
						</MenuLink>
					)
				})}
			</ul>
		)
	}
}

Menu.propTypes = {
	locale: PropTypes.string.isRequired,
	location: PropTypes.object.isRequired,
	children: PropTypes.arrayOf(PropTypes.shape({
		link: PropTypes.string.isRequired,
		title: PropTypes.string.isRequired,
		selected: PropTypes.bool,
		outlineIcon: PropTypes.func.isRequired,
		fillIcon: PropTypes.func.isRequired
	}))
}

export function MenuLink({ to, title, selected, children })
{
	return (
		<li className="menu-list-item">
			<Link
				to={to}
				title={title}
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
	title: PropTypes.string.isRequired,
	selected: PropTypes.bool,
	children: PropTypes.node.isRequired
}