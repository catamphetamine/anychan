import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { connect } from 'react-redux'

import SimpleBar from 'simplebar-react'

import Boards from '../components/Boards'
import TrackedThreads from '../components/TrackedThreads'
import Notifications from '../components/Notifications'

import './Sidebar.css'

@connect(({ app }) => ({
	isShown: app.isSidebarShown,
	mode: app.sidebarMode
}))
export default class Sidebar_ extends React.Component {
	render() {
		return <Sidebar {...this.props}/>
	}
}

function Sidebar({ isShown, mode }) {
	return (
		<section className={classNames('sidebar', {
			'sidebar--show': isShown
		})}>
			<SimpleBar className="sidebar__scrollable-list">
				{mode === 'boards' && <Boards/>}
				{mode === 'tracked-threads' && <TrackedThreads/>}
				{mode === 'notifications' && <Notifications/>}
			</SimpleBar>
		</section>
	)
}

Sidebar.propTypes = {
	isShown: PropTypes.bool
}