import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

import { updatePageIcon } from '../utility/pageIcon'
import { getProvider } from '../provider'

export default function ApplicationIcon() {
	const unreadAutoUpdateCommentsCount = useSelector(({ data }) => data.unreadAutoUpdateCommentsCount)
	const hasNotifications = useRef()
	useEffect(() => {
		if (unreadAutoUpdateCommentsCount > 0) {
			if (!hasNotifications.current) {
				hasNotifications.current = true
				showNotificationIcon()
			}
		} else {
			if (hasNotifications.current) {
				hasNotifications.current = false
				hideNotificationIcon()
			}
		}
	}, [unreadAutoUpdateCommentsCount])
	return null
}

function showNotificationIcon() {
	updatePageIcon(getProvider().icon, { notificationsCount: 1 })
}

function hideNotificationIcon() {
	updatePageIcon(getProvider().icon, { notificationsCount: 0 })
}