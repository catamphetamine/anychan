import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { meta, Link } from 'react-website'
import classNames from 'classnames'

import { getChan } from '../chan'
import getMessages from '../messages'

import { ErrorPage } from './Error'

// import './Offline.css'

@meta(({ app }) => ({
	title: getMessages(app.settings.locale).errorPages['503'].title
}))
@connect(({ app, found }) => ({
	locale: app.settings.locale,
	location: found.resolvedMatch.location
}))
export default class Offline extends React.Component {
	static propTypes = {
		locale: PropTypes.string.isRequired,
		location: PropTypes.object.isRequired
	}
	render() {
		return <ErrorPage {...this.props} status={503}/>
	}
}