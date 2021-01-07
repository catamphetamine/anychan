import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-pages'
import classNames from 'classnames'

import getMessages from '../messages'

import ErrorPage from './Error'

// import './Offline.css'

export default function Offline() {
	return <ErrorPage status={503}/>
}

Offline.meta = ({ settings }) => ({
	title: getMessages(settings.settings.locale).errorPages['503'].title
})