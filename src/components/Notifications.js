import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import getMessages from '../messages'

import './Notifications.css'

@connect(({ app }) => ({
	locale: app.settings.locale
}))
export default class Notifications_ extends React.Component {
	render() {
		return <Notifications {...this.props}/>
	}
}

function Notifications({ locale }) {
	return (
		<section className="notifications notifications--empty">
			<div className="notifications__empty">
				{getMessages(locale).notifications.empty}
			</div>
		</section>
	)
}

Notifications.propTypes = {
	locale: PropTypes.string.isRequired
}
