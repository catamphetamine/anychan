import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-pages'
import classNames from 'classnames'

import getMessages from '../messages/index.js'

import ErrorPage from './Error.js'

// import './NotFound.css'

export default function NotFound() {
	return <ErrorPage status={404}/>
}

NotFound.meta = ({ settings }) => ({
	title: getMessages(settings.settings.locale).errorPages['404'].title
})