import React, { useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { connect } from 'react-redux'

import SimpleBar from 'simplebar-react'

import Boards, { FavoriteBoards } from './Boards'
import TrackedThreads from './TrackedThreads'
import Notifications from './Notifications'
import SidebarSection from './SidebarSection'
import EditFavoriteBoards from './EditFavoriteBoards'

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
	const [editingFavoriteBoards, setEditingFavoriteBoards] = useState()
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
					<SidebarSection
						title={getMessages(locale).boards.title}
						moreLabel={getMessages(locale).actions.edit}
						onMore={setEditingFavoriteBoards}>
						{editingFavoriteBoards && <EditFavoriteBoards boards={favoriteBoards}/>}
						{!editingFavoriteBoards && <FavoriteBoards boards={favoriteBoards}/>}
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