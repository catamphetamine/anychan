// This component isn't currently used in the app.

import React from 'react'

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
