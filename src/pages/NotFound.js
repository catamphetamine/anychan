import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-pages'
import classNames from 'classnames'

import useMessages from '../hooks/useMessages.js'

import ErrorPage from './Error.js'

// import './NotFound.css'

export default function NotFound() {
	return <ErrorPage status={404}/>
}

NotFound.meta = ({ useSelector }) => {
	const messages = useMessages({ useSelector })
	return {
		title: messages.errorPages['404'].title
	}
}