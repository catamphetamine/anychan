import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-pages'
import classNames from 'classnames'

import { getChan } from '../chan'
import getMessages from '../messages'

import ErrorPage from './Error'

// import './NotFound.css'

export default function NotFound() {
	return <ErrorPage status={404}/>
}

NotFound.meta = ({ settings }) => ({
	title: getMessages(settings.settings.locale).errorPages['404'].title
})