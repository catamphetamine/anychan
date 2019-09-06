import React from 'react'
import PropTypes from 'prop-types'
import { MenuIcon } from 'react-responsive-ui'
import { Link } from 'react-website'
import { connect } from 'react-redux'
import classNames from 'classnames'

import ApplicationMenu from './ApplicationMenu'
import ChanIcon from './ChanIcon'
import ChanLogo from './ChanLogo'

import getMessages from '../messages'
import {
	isBoardLocation,
	isThreadLocation
} from '../utility/routes'
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
			<nav className="webpage__header rrui__fixed-full-width">
				<Link
					to={addChanParameter('/')}
					title={getChan().title}
					className="header__logo-link">
					{['lainchan', 'arisuchan'].includes(getChan().id) &&
						<ChanLogo className="header__logo"/>
					}
					{!['lainchan', 'arisuchan'].includes(getChan().id) &&
						<ChanIcon className="header__logo"/>
					}
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
						{board.title}
					</Link>
				}
				{isBoardPage && !isThreadLocation(route) &&
					<div className="webpage__header-title webpage__header-title--primary">
						{board.title}
					</div>
				}

				<HeaderSeparator
					line
					className={classNames('header__separator', 'header__separator--left', {
						'header__separator--thread': isThreadPage
					})}/>

				<div className="webpage__header-title webpage__header-title--secondary">
					{isThreadPage && (thread.titleCensored || thread.title)}
				</div>

				<HeaderSeparator
					inverse
					line
					className={classNames(
						'header__separator',
						'header__separator--right'
					)}/>
				<ApplicationMenu/>
			</nav>
		)
	}
}

// Using `0.1` instead of `0` and `2.9` instead of `3.0` here
// to add some side padding for the `<line/>` so that it isn't clipped.
const HEADER_SEPARATOR_POINTS = '0,0 2.9,0 0.1,10 0,10'
const HEADER_SEPARATOR_INVERSE_POINTS = '3,0 2.9,0 0.1,10 3,10'

function HeaderSeparator({ inverse, line, ...rest }) {
	return (
		<svg {...rest} viewBox="0 0 3 10">
			<polyline
				stroke="none"
				fill="currentColor"
				points={inverse ? HEADER_SEPARATOR_INVERSE_POINTS : HEADER_SEPARATOR_POINTS}/>
			{line &&
				<line
					x1="0.1"
					y1="10"
					x2="2.9"
					y2="0"
					stroke="currentColor"
					strokeWidth="1"
					className="header__separator-line" />
			}
		</svg>
	)
}

HeaderSeparator.propTypes = {
	inverse: PropTypes.bool,
	line: PropTypes.bool
}