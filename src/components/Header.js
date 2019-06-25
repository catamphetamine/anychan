import React from 'react'
import { MenuIcon } from 'react-responsive-ui'
import { Link } from 'react-website'
import { connect } from 'react-redux'
import classNames from 'classnames'

import ApplicationMenu from './ApplicationMenu'
import ChanIcon from './ChanIcon'

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
				<Link
					to={addChanParameter('/')}
					title={getChan().title}
					className="header__logo-link">
					<ChanIcon className="header__logo"/>
				</Link>

				{!isBoardPage && !isThreadPage &&
					<Link
						to={addChanParameter('/')}
						className="webpage__header-title webpage__header-title--primary header__uncolored-link">
						{getChan().title}
					</Link>
				}
				{isBoardPage && isThreadLocation(route) &&
					<Link
						instantBack
						to={getUrl(board)}
						className="webpage__header-title webpage__header-title--primary header__uncolored-link">
						{board.name}
					</Link>
				}
				{isBoardPage && !isThreadLocation(route) &&
					<div className="webpage__header-title webpage__header-title--primary">
						{board.name}
					</div>
				}

				<div className={classNames('header__separator', {
					'header__separator--thread': isThreadPage
				})}/>

				<div className="webpage__header-title webpage__header-title--secondary">
					{isThreadPage &&
						thread.subject
					}
				</div>

				<ApplicationMenu/>
			</nav>
		)
	}
}