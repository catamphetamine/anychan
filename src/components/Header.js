import React from 'react'
import PropTypes from 'prop-types'
import { MenuIcon } from 'react-responsive-ui'
import { Link } from 'react-pages'
import { useSelector } from 'react-redux'
import classNames from 'classnames'

import ProviderIcon from './ProviderIcon'
import ProviderLogo from './ProviderLogo'
import MainMenu from './MainMenu'

import ThreadTitle from './ThreadTitle'

import {
	isChannelLocation,
	isThreadLocation
} from '../utility/routes'

import getUrl from '../utility/getUrl'
import { getProvider, getProviderId } from '../provider'
import getMessages from '../messages'

import './Header.css'

function Header({}, ref) {
	const locale = useSelector(({ settings }) => settings.settings.locale)
	const channel = useSelector(({ data }) => data.channel)
	const thread = useSelector(({ data }) => data.thread)
	const route = useSelector(({ found }) => found.resolvedMatch)

	const isChannelPage = (isChannelLocation(route) || isThreadLocation(route)) && channel
	const isThreadPage = isThreadLocation(route) && thread

	const title = getProvider().title

	return (
		<nav ref={ref} className="Header rrui__fixed-full-width">
			<Link
				to="/"
				title={getProvider().title}
				className="Header-logoLink">
				{['lainchan', 'arisuchan'].includes(getProviderId()) &&
					<ProviderLogo className="Header-logo"/>
				}
				{!['lainchan', 'arisuchan'].includes(getProviderId()) &&
					<ProviderIcon className="Header-logo"/>
				}
			</Link>

			{!isChannelPage && !isThreadPage &&
				<Link
					to="/"
					className="Header-title Header-title--primary Header-link--nonColored">
					{title}
				</Link>
			}
			{isChannelPage && isThreadLocation(route) &&
				<Link
					instantBack
					to={getUrl(channel.id)}
					className="Header-title Header-title--primary Header-link--nonColored">
					{channel.title}
				</Link>
			}
			{isChannelPage && !isThreadLocation(route) &&
				<div className="Header-title Header-title--primary">
					{channel.title}
				</div>
			}

			<HeaderSeparator
				line
				className={classNames('Header-separator', 'Header-separator--left', {
					'Header-separator--thread': isThreadPage
				})}/>

			<div className="Header-title Header-title--secondary">
				{isThreadPage &&
					<ThreadTitle thread={thread}/>
				}
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