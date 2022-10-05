import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-pages'
import { useSelector } from 'react-redux'
import classNames from 'classnames'

import ProviderIcon from '../ProviderIcon.js'
import ProviderLogo from '../ProviderLogo.js'

import useRoute from '../../hooks/useRoute.js'

import { getProvider } from '../../provider.js'

export default function HomePageLink({ includeTitle }) {
	const route = useRoute()
	const locationPathname = route.location.pathname
	const isHomePage = locationPathname === '/'
	const title = getProvider().title
	return (
		<Link
			to="/"
			title={includeTitle ? undefined : title}
			className={classNames('SidebarMenuItem', 'SidebarMenuItem--logo', {
				'SidebarMenuItem--includeTitle': includeTitle,
				'SidebarMenuItem--icon': !includeTitle,
				'SidebarMenuItem--selected': isHomePage
			})}>
			{/*
			<HomePageIcon
				providerId={getProviderId()}
				className="SidebarMenuItem-icon"/>
			*/}
			<SlashIcon className="SidebarMenuItem-icon"/>
			{includeTitle &&
				<span className="SidebarMenuItem-title">
					{title}
				</span>
			}
		</Link>
	)
}

HomePageLink.propTypes = {
	includeTitle: PropTypes.bool
}

function HomePageIcon({ providerId, ...rest }) {
	if (providerId === 'lainchan' || providerId === 'arisuchan') {
		return <ProviderLogo {...rest}/>
	}
	return <ProviderIcon {...rest}/>
}

HomePageIcon.propTypes = {
	providerId: PropTypes.string.isRequired
}

// Using `0.1` instead of `0` and `2.9` instead of `3.0` here
// to add some side padding for the `<line/>` so that it isn't clipped.
const SLASH_ICON_POINTS = '4.9,0 0.1,10'

function SlashIcon(props) {
	return (
		<svg {...props} viewBox="0 0 5 10">
			<polyline
				stroke="none"
				fill="currentColor"
				points={SLASH_ICON_POINTS}/>
				<line
					x1="0.1"
					y1="10"
					x2="4.9"
					y2="0"
					stroke="currentColor"
					strokeWidth="0.4"
					className="SidebarMenu-slashIconLine" />
		</svg>
	)
}