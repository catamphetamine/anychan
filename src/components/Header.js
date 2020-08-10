import React from 'react'
import PropTypes from 'prop-types'
import { MenuIcon } from 'react-responsive-ui'
import { Link } from 'react-pages'
import { useSelector } from 'react-redux'
import classNames from 'classnames'

import ChanIcon from './ChanIcon'
import ChanLogo from './ChanLogo'
import MainMenu from './MainMenu'

import getMessages from '../messages'
import {
	isBoardLocation,
	isThreadLocation
} from '../utility/routes'
import getUrl from '../utility/getUrl'
import { getChan, getChanId } from '../chan'

import './Header.css'

function Header({}, ref) {
	const locale = useSelector(({ settings }) => settings.settings.locale)
	const board = useSelector(({ chan }) => chan.board)
	const thread = useSelector(({ chan }) => chan.thread)
	const route = useSelector(({ found }) => found.resolvedMatch)

	const isBoardPage = (isBoardLocation(route) || isThreadLocation(route)) && board
	const isThreadPage = isThreadLocation(route) && thread

	const title = getChan().title

	return (
		<nav ref={ref} className="Header rrui__fixed-full-width">
			<Link
				to="/"
				title={getChan().title}
				className="Header-logoLink">
				{['lainchan', 'arisuchan'].includes(getChanId()) &&
					<ChanLogo className="Header-logo"/>
				}
				{!['lainchan', 'arisuchan'].includes(getChanId()) &&
					<ChanIcon className="Header-logo"/>
				}
			</Link>

			{!isBoardPage && !isThreadPage &&
				<Link
					to="/"
					className="Header-title Header-title--primary Header-link--nonColored">
					{title}
				</Link>
			}
			{isBoardPage && isThreadLocation(route) &&
				<Link
					instantBack
					to={getUrl(board)}
					className="Header-title Header-title--primary Header-link--nonColored">
					{board.title}
				</Link>
			}
			{isBoardPage && !isThreadLocation(route) &&
				<div className="Header-title Header-title--primary">
					{board.title}
				</div>
			}

			<HeaderSeparator
				line
				className={classNames('Header-separator', 'Header-separator--left', {
					'Header-separator--thread': isThreadPage
				})}/>

			<div className="Header-title Header-title--secondary">
				{isThreadPage && (thread.titleCensored || thread.title)}
			</div>

			<HeaderSeparator
				inverse
				line
				className={classNames(
					'Header-separator',
					'Header-separator--right'
				)}/>
			<MainMenu/>
		</nav>
	)
}

Header = React.forwardRef(Header)

export default Header

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
					className="Header-separatorLine" />
			}
		</svg>
	)
}

HeaderSeparator.propTypes = {
	inverse: PropTypes.bool,
	line: PropTypes.bool
}