import React from 'react'
import { MenuIcon } from 'react-responsive-ui'
import { Link } from 'react-website'
import { connect } from 'react-redux'

import ApplicationMenu from './ApplicationMenu'
import ChanLogo, { hasLogo } from './ChanLogo'

import getMessages from '../messages'
import { isBoardLocation, isThreadLocation } from '../utility/routes'
import getUrl from '../utility/getUrl'
import { getChan, addChanParameter } from '../chan'

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

		const isBoardPage = (isBoardLocation(route) || isThreadLocation(route)) && board
		const isThreadPage = isThreadLocation(route) && thread

		return (
			<nav className="webpage__header">
				{hasLogo() &&
					<Link
						to={addChanParameter('/')}
						title={getChan().title}
						className="header__logo-link">
						<ChanLogo className="header__logo"/>
					</Link>
				}

				<div className="header__title">
					{!isBoardPage && !isThreadPage &&
						<Link
							to={addChanParameter('/')}
							className="header__uncolored-link">
							{getChan().title}
						</Link>
					}
					{isBoardPage &&
						<span className="header__board-title">
							{isThreadLocation(route) &&
								<Link
									instantBack
									to={getUrl(board)}
									className="header__uncolored-link">
									{board.name}
								</Link>
							}
							{!isThreadLocation(route) && board.name}
						</span>
					}
					{isThreadPage &&
						<div className="header__separator"/>
					}
					{isThreadPage &&
						<span className="header__thread-title">
							{thread.subject}
						</span>
					}
				</div>

				<ApplicationMenu/>
			</nav>
		)
	}
}