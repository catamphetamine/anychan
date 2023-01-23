import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import classNames from 'classnames'

import { getSettingsMenuItem } from '../MainMenu.js'
import SidebarMenuItem from '../Sidebar/SidebarMenuItem.js'

import useMessages from '../../hooks/useMessages.js'
import useRoute from '../../hooks/useRoute.js'

export default function SettingsLink({ withLabel }) {
	const dispatch = useDispatch()
	const messages = useMessages()

	const settingsMenuItem = useMemo(() => getSettingsMenuItem({ messages }), [messages])

	const route = useRoute()
	const locationPathname = route.location.pathname

	const isSettingsPage = locationPathname === settingsMenuItem.pathname

	const SettingsIcon = isSettingsPage
		? settingsMenuItem.iconActive
		: settingsMenuItem.icon

	const title = messages.settings.title

	return (
		<SidebarMenuItem
			link={settingsMenuItem.url}
			label={title}
			showLabel={withLabel}
			selected={isSettingsPage}
			IconComponent={SettingsIcon}
		/>
	)
}

SettingsLink.propTypes = {
	withLabel: PropTypes.bool
}

