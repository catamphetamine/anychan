import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Boards from '../components/Boards'

import './Sidebar.css'

export default class Sidebar extends React.Component {
	static propTypes = {
		show: PropTypes.bool
	}

	render() {
		const { show } = this.props

		return (
			<section className={classNames('sidebar', {
				'sidebar--show': show,
				'sidebar--dark': true,
				'sidebar--light': false
			})}>
				<Boards/>
			</section>
		)
	}
}