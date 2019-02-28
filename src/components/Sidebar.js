import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { connect } from 'react-redux'

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
				<Boards/>
			</section>
		)
	}
}

Sidebar.propTypes = {
	isShown: PropTypes.bool
}