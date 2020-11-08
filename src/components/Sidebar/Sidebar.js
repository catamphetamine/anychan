import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { useSelector } from 'react-redux'

import SimpleBar from 'simplebar-react'

import { HomePageLink, SettingsLink, DarkModeToggle } from './SidebarMenu'

// import BoardOrThreadTitle from './BoardOrThreadTitle'
import SidebarMenuSection from './SidebarMenuSection'
import BoardsSidebarSection from './BoardsSidebarSection'
import FavoriteBoardsSidebarSection from './FavoriteBoardsSidebarSection'
import TrackedThreadsSidebarSection from './TrackedThreadsSidebarSection'

import getMessages from '../../messages'

import './Sidebar.css'

export default function Sidebar() {
	const locale = useSelector(({ settings }) => settings.settings.locale)
	const isShown = useSelector(({ app }) => app.isSidebarShown)
	// const mode = useSelector(({ app }) => app.sidebarMode)
	return (
		<section className={classNames('Sidebar', {
			'Sidebar--show': isShown
		})}>
			<SimpleBar className="Sidebar-scrollableList">
				<div className="Sidebar-topBar">
					{/*<BoardOrThreadTitle/>*/}
					{/*<div className="Sidebar-topBarRight">*/}
						<DarkModeToggle/>
						<SettingsLink/>
						{/*<HomePageLink/>*/}
					{/*</div>*/}
				</div>
				<SidebarMenuSection/>
				<TrackedThreadsSidebarSection/>
				<FavoriteBoardsSidebarSection/>
				<BoardsSidebarSection/>
			</SimpleBar>
		</section>
	)
}

Sidebar.propTypes = {
	// isShown: PropTypes.bool,
	// locale: PropTypes.string.isRequired,
	// mode: PropTypes.string.isRequired
}