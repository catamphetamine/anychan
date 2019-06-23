import React from 'react'
import { MenuIcon } from 'react-responsive-ui'
import { Link } from 'react-website'
import { connect } from 'react-redux'

import ApplicationMenu from './ApplicationMenu'
import ChanLogo from './ChanLogo'

import getMessages from '../messages'
import { isBoardLocation, isThreadLocation } from '../utility/routes'
import getUrl from '../utility/getUrl'
import { addChanParameter } from '../chan'

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
				<Link
					to={addChanParameter('/')}
					className="header__logo-link">
					<ChanLogo className="header__logo"/>
				</Link>

				<div className="header__title">
					{(isBoardLocation(route) || isThreadLocation(route)) && board &&
						<span className="header__board-title">
							{isThreadLocation(route) &&
								<Link to={getUrl(board)} instantBack>
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