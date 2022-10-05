import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-pages'
import { useSelector, useDispatch } from 'react-redux'
import classNames from 'classnames'

import { getSettingsMenuItem } from '../MainMenu.js'

import useMessages from '../../hooks/useMessages.js'
import useRoute from '../../hooks/useRoute.js'

export default function SettingsLink({ includeTitle }) {
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
		<Link
			to={settingsMenuItem.url}
			title={includeTitle ? undefined : title}
			className={classNames('SidebarMenuItem', {
				'SidebarMenuItem--includeTitle': includeTitle,
				'SidebarMenuItem--icon': !includeTitle,
				'SidebarMenuItem--selected': isSettingsPage
			})}>
			<SettingsIcon className="SidebarMenuItem-icon"/>
			{includeTitle &&
				<span className="SidebarMenuItem-title">
					{title}
				</span>
			}
		</Link>
	)
}

SettingsLink.propTypes = {
	includeTitle: PropTypes.bool
}

