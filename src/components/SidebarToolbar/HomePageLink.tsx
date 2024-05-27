import React from 'react'
import PropTypes from 'prop-types'

import SidebarMenuItem from '../Sidebar/SidebarMenuItem.js'

import useRoute from '../../hooks/useRoute.js'
import useDataSource from '../../hooks/useDataSource.js'

import './HomePageLink.css'

// This component is not used.
export default function HomePageLink({ withLabel }: HomePageLinkProps) {
	const route = useRoute()
	const dataSource = useDataSource()

	const locationPathname = route.location.pathname
	const isHomePage = locationPathname === '/'

	const title = dataSource.title

	return (
		<SidebarMenuItem
			link="/"
			label={title}
			showLabel={withLabel}
			className="HomePageLink"
			selected={isHomePage}
			IconComponent={SlashIcon}
		/>
	)
}

HomePageLink.propTypes = {
	withLabel: PropTypes.bool
}

interface HomePageLinkProps {
	withLabel?: boolean
}

/*
function HomePageIcon({ dataSourceId, ...rest }) {
	if (dataSourceId === 'lainchan' || dataSourceId === 'arisuchan') {
		return <DataSourceLogo dataSource={...} {...rest}/>
	}
	return <DataSourceIcon dataSource={...} {...rest}/>
}

HomePageIcon.propTypes = {
	dataSourceId: PropTypes.string.isRequired
}
*/

// Using `0.1` instead of `0` and `2.9` instead of `3.0` here
// to add some side padding for the `<line/>` so that it isn't clipped.
const SLASH_ICON_POINTS = '4.9,0 0.1,10'

function SlashIcon(props: object) {
	return (
		<svg {...props} viewBox="0 0 5 10">
			<polyline
				stroke="none"
				fill="currentColor"
				points={SLASH_ICON_POINTS}
			/>
			<line
				x1="0.1"
				y1="10"
				x2="4.9"
				y2="0"
				stroke="currentColor"
				strokeWidth="0.4"
				className="SidebarMenu-slashIconLine"
			/>
		</svg>
	)
}