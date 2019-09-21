import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { connect } from 'react-redux'

import SimpleBar from 'simplebar-react'

import Boards from './Boards'
import TrackedThreads from './TrackedThreads'
import Notifications from './Notifications'
import SidebarSection from './SidebarSection'

import SortableList from 'webapp-frontend/src/components/SortableList'

import FavoriteBoardsSidebarSection from './FavoriteBoardsSidebarSection'

import getMessages from '../messages'

import './Sidebar.css'

@connect(({ app, threadTracker }) => ({
	locale: app.settings.locale,
	isShown: app.isSidebarShown,
	mode: app.sidebarMode,
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
				<FavoriteBoardsSidebarSection/>
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