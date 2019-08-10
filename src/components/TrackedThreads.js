import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import getMessages from '../messages'

import './TrackedThreads.css'

@connect(({ app }) => ({
	locale: app.settings.locale
}))
export default class TrackedThreads_ extends React.Component {
	render() {
		return <TrackedThreads {...this.props}/>
	}
}

function TrackedThreads({ locale }) {
	return (
		<section className="tracked-threads">
			{getMessages(locale).trackedThreads.empty}
		</section>
	)
}

TrackedThreads.propTypes = {
	locale: PropTypes.string.isRequired
}