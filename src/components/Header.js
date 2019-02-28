import React from 'react'
import { MenuIcon } from 'react-responsive-ui'
import { Link } from 'react-website'
import { connect } from 'react-redux'

import ApplicationMenu from './ApplicationMenu'

// import HomeIcon  from '../../assets/images/home.svg'
// import UsersIcon from '../../assets/images/users.svg'

// import Logo from '../../assets/images/icon@192x192.png'

import { addChanParameter } from '../chan'
import getMessages from '../messages'
import { isBoardLocation, isThreadLocation } from '../utility/routes'

import './Header.css'

@connect(({ app, chan, found }) => ({
	locale: app.settings.locale,
	board: chan.board,
	thread: chan.thread,
	route: found.resolvedMatch
}))
export default class Header extends React.Component {
	render() {
		const {
			locale,
			route,
			board,
			thread
		} = this.props

		return (
			<nav className="webpage__header">
				{/*
				<Link to={addChanParameter('/')} className="header__logo-link">
					<img src={Logo} className="header__logo"/>
				</Link>
				*/}

				<div className="header__title">
					{(isBoardLocation(route) || isThreadLocation(route)) && board &&
						<span className="header__board-title">
							{isThreadLocation(route) &&
								<Link to={addChanParameter(`/${board.id}`)} instantBack>
									{board.name}
								</Link>
							}
							{!isThreadLocation(route) && board.name}
						</span>
					}
					{isThreadLocation(route) && thread &&
						<span className="header__thread-title">
							{thread.subject && ' → '}
							{thread.subject}
						</span>
					}
				</div>

				<ApplicationMenu/>
			</nav>
		)
	}
}