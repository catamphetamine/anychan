import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-pages'
import classNames from 'classnames'

import useMessages from '../hooks/useMessages.js'

import ErrorPage from './Error.js'

// import './Offline.css'

export default function Offline() {
	return <ErrorPage status={503}/>
}

Offline.meta = ({ useSelector }) => {
	const messages = useMessages({ useSelector })
	return {
		title: messages.errorPages['503'].title
	}
}