import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { connect } from 'react-redux'

import SimpleBar from 'simplebar-react'

import Boards from '../components/Boards'
import TrackedThreads from '../components/TrackedThreads'
import Notifications from '../components/Notifications'
import SidebarSection from '../components/SidebarSection'

import SortableList from 'webapp-frontend/src/components/SortableList'

import getMessages from '../messages'

import './Sidebar.css'

@connect(({ app, favoriteBoards, threadTracker }) => ({
	locale: app.settings.locale,
	isShown: app.isSidebarShown,
	mode: app.sidebarMode,
	favoriteBoards: favoriteBoards.favoriteBoards,
	trackedThreads: threadTracker.trackedThreads
}))
export default class Sidebar_ extends React.Component {
	render() {
		return <Sidebar {...this.props}/>
	}
}

function Sidebar({
	isShown,
	mode,
	locale,
	favoriteBoards,
	trackedThreads
}) {
	// {mode === 'boards' && <Boards/>}
	// {mode === 'tracked-threads' && <TrackedThreads/>}
	// {mode === 'notifications' && <Notifications/>}
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
				{favoriteBoards.length > 0 &&
					<SidebarSection title={getMessages(locale).boards.title}>
						<Boards boards={favoriteBoards}/>
					</SidebarSection>
				}
				<SidebarSection title={getMessages(locale).boards.all}>
					<Boards/>
				</SidebarSection>
			</SimpleBar>
		</section>
	)
}

Sidebar.propTypes = {
	isShown: PropTypes.bool,
	locale: PropTypes.string.isRequired,
	mode: PropTypes.string.isRequired
}