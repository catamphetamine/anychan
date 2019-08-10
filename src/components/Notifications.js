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
		<section className="notifications">
			{getMessages(locale).notifications.empty}
		</section>
	)
}

Notifications.propTypes = {
	locale: PropTypes.string.isRequired
}
