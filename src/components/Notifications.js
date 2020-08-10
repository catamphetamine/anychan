// This component isn't currently used in the app.

import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import getMessages from '../messages'

import './Notifications.css'

export default function Notifications() {
	const locale = useSelector(({ settings }) => settings.settings.locale)
	return (
		<section className="Notifications Notifications--empty">
			<div className="Notifications-empty">
				{getMessages(locale).notifications.empty}
			</div>
		</section>
	)
}
