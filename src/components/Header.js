import React from 'react'
import { MenuIcon } from 'react-responsive-ui'
import { Link } from 'react-website'
import { connect } from 'react-redux'

import ApplicationMenu from './ApplicationMenu'

// import HomeIcon  from '../../assets/images/home.svg'
// import UsersIcon from '../../assets/images/users.svg'

import './Header.css'

@connect(({ chan, found }) => ({
	board: chan.board,
	thread: chan.thread,
  location: found.resolvedMatch.location
}))
export default class Header extends React.Component {
	render() {
		const { board, thread } = this.props
		return (
			<nav className="webpage__header">
				<div className="container">
					<div className="webpage__header__row">
						{/*<Menu>
							<MenuLink to="/" exact>
								<HomeIcon className="menu-item__icon menu-item__icon--home"/>
								Home
							</MenuLink>
							<MenuLink to="/users">
								<UsersIcon className="menu-item__icon menu-item__icon--users"/>
								Users
							</MenuLink>
						</Menu>*/}

						{/*
						<Link to="/" className="header__link">
							<MenuIcon className="menu-button"/>
						</Link>
						*/}

						{(isBoardLocation(location) || isThreadLocation(location)) &&
							<div className="header__title">
								{(isBoardLocation(location) || isThreadLocation(location)) && board &&
									<span className="header__board-title">
										{thread &&
											<Link to={`/${board.id}`} instantBack>
												{board.name}
											</Link>
										}
										{!thread && board.name}
									</span>
								}
								{isThreadLocation(location) && thread &&
									<span className="header__thread-title">
										{' → '}{thread.posts[0].subject || 'Тред'}
									</span>
								}
							</div>
						}

						<ApplicationMenu/>
					</div>
				</div>
			</nav>
		)
	}
}

function isBoardLocation(location) {
	// Trim trailing slash.
	const path = location.pathname.replace(/\/$/, '')
	return /^\/([^\/]+)$/.test(path) && path !== '/' && path !== '/profile'
}

function isThreadLocation(location) {
	// Trim trailing slash.
	const path = location.pathname.replace(/\/$/, '')
	return /^\/([^\/]+)\/([^\/]+)$/.test(path)
}