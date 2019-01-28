import React from 'react'
import { MenuIcon } from 'react-responsive-ui'
import { Link } from 'react-website'
import { connect } from 'react-redux'

import ApplicationMenu from './ApplicationMenu'

// import HomeIcon  from '../../assets/images/home.svg'
// import UsersIcon from '../../assets/images/users.svg'

import Logo from '../../assets/images/icon@192x192.png'

import './Header.css'

@connect(({ chan, found }) => ({
	board: chan.board,
	thread: chan.thread,
  route: found.resolvedMatch
}))
export default class Header extends React.Component {
	render() {
		const {
			route,
			board,
			thread
		} = this.props

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

						<Link to="/" className="header__logo-link">
							<img src={Logo} className="header__logo"/>
						</Link>

						<div className="header__title">
							{(isBoardLocation(route) || isThreadLocation(route)) && board &&
								<span className="header__board-title">
									{thread &&
										<Link to={`/${board.id}`} instantBack>
											{board.name}
										</Link>
									}
									{!thread && board.name}
								</span>
							}
							{isThreadLocation(route) && thread &&
								<span className="header__thread-title">
									{' → '}{thread.posts[0].subject || 'Тред'}
								</span>
							}
						</div>

						<ApplicationMenu/>
					</div>
				</div>
			</nav>
		)
	}
}

function isBoardLocation({ location, params }) {
	return params.board
}

function isThreadLocation({ location, params }) {
	return params.thread
}