import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-website'
import classNames from 'classnames'

import { toggleSidebar, toggleNightMode } from '../redux/app'

import { addChanParameter } from '../chan'
import getMessages from '../messages'

import './Menu.css'

@connect(({ app, found }) => ({
	isSidebarShown: app.isSidebarShown,
	isNightMode: app.isNightMode,
	locale: app.settings.locale,
	location: found.resolvedMatch.location
}), {
	toggleSidebar
})
export default class Menu extends React.Component {
	// onClick={this.hideSidebar}
	// hideSidebar = () => {
	// 	const {
	// 		isSidebarShown,
	// 		toggleSidebar
	// 	} = this.props
	// 	if (isSidebarShown) {
	// 		toggleSidebar()
	// 	}
	// }

	render() {
		const {
			locale,
			location,
			isSidebarShown,
			isNightMode,
			toggleSidebar,
			toggleNightMode,
			className,
			children
		} = this.props

		return (
			<ul className={classNames('menu', className)}>
				{children.map(({ type, link, title, outlineIcon, fillIcon }, i) => {
					let isActive
					if (type === 'sidebar') {
						isActive = isSidebarShown
					} else if (type === 'night-mode') {
						isActive = isNightMode
					} else {
						isActive = !isSidebarShown && location.pathname === link
					}
					title = getMessages(locale)[title].title
					const icon = React.createElement(
						isActive ? fillIcon : outlineIcon,
						{ className: 'menu-item__icon' }
					)
					return (
						<li
							key={i}
							className="menu-list-item">
							{type === 'sidebar' &&
								<button
									title={title}
									onClick={toggleSidebar}
									className={classNames('rrui__button-reset', 'menu-item', isActive && 'menu-item--selected')}>
									{icon}
								</button>
							}
							{type === 'night-mode' &&
								<button
									title={title}
									onClick={toggleNightMode}
									className={classNames('rrui__button-reset', 'menu-item', isActive && 'menu-item--selected')}>
									{icon}
								</button>
							}
							{link &&
								<Link
									to={link}
									title={title}
									activeClassName="menu-item--selected"
									className="menu-item">
									{icon}
								</Link>
							}
						</li>
					)
				})}
			</ul>
		)
	}
}

Menu.propTypes = {
	locale: PropTypes.string.isRequired,
	location: PropTypes.object.isRequired,
	isSidebarShown: PropTypes.bool,
	isNightMode: PropTypes.bool,
	toggleSidebar: PropTypes.func.isRequired,
	toggleNightMode: PropTypes.func.isRequired,
	type: PropTypes.oneOf(['sidebar', 'night-mode']),
	children: PropTypes.arrayOf(PropTypes.shape({
		link: PropTypes.string.isRequired,
		title: PropTypes.string.isRequired,
		selected: PropTypes.bool,
		outlineIcon: PropTypes.func.isRequired,
		fillIcon: PropTypes.func.isRequired
	}))
}