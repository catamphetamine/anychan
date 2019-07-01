import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { connect } from 'react-redux'

import SimpleBar from 'simplebar-react'

import Boards from '../components/Boards'

import './Sidebar.css'

@connect(({ app }) => ({
	isShown: app.isSidebarShown
}))
export default class Sidebar extends React.Component {
	render() {
		const { isShown } = this.props
		return (
			<section className={classNames('sidebar', {
				'sidebar--show': isShown,
				'sidebar--dark': true,
				'sidebar--light': false
			})}>
				<SimpleBar className="sidebar__scrollable-list">
					<Boards sidebar/>
				</SimpleBar>
			</section>
		)
	}
}

Sidebar.propTypes = {
	isShown: PropTypes.bool
}