import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { useSelector } from 'react-redux'

import SimpleBar from 'simplebar-react'

import Boards from './Boards'
import TrackedThreads from './TrackedThreads'
import Notifications from './Notifications'
import SidebarSection from './SidebarSection'

import FavoriteBoardsSidebarSection from './FavoriteBoardsSidebarSection'

import getMessages from '../messages'

import './Sidebar.css'

export default function Sidebar() {
	// {mode === 'boards' && <Boards/>}
	// {mode === 'tracked-threads' && <TrackedThreads/>}
	// {mode === 'notifications' && <Notifications/>}
	const locale = useSelector(({ settings }) => settings.settings.locale)
	const isShown = useSelector(({ app }) => app.isSidebarShown)
	const mode = useSelector(({ app }) => app.sidebarMode)
	const trackedThreads = useSelector(({ threadTracker }) => threadTracker.trackedThreads)
	return (
		<section className={classNames('sidebar', {
			'sidebar--show': isShown
		})}>
			<SimpleBar className="sidebar__scrollable-list">
				{trackedThreads.length > 0 &&
					<SidebarSection title={getMessages(locale).trackedThreads.title}>
						<TrackedThreads/>
					</SidebarSection>
				}
				<FavoriteBoardsSidebarSection/>
				<SidebarSection title={getMessages(locale).boards.all}>
					<Boards/>
				</SidebarSection>
			</SimpleBar>
		</section>
	)
}

Sidebar.propTypes = {
	// isShown: PropTypes.bool,
	// locale: PropTypes.string.isRequired,
	// mode: PropTypes.string.isRequired
}