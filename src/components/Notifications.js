// This component isn't currently used in the app.

import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import useMessages from '../hooks/useMessages.js'

import './Notifications.css'

export default function Notifications() {
	const messages = useMessages()
	return (
		<section className="Notifications Notifications--empty">
			<div className="Notifications-empty">
				{messages.notifications.empty}
			</div>
		</section>
	)
}
