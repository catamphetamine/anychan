import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-pages'
import { useSelector, useDispatch } from 'react-redux'
import classNames from 'classnames'

import { getSettingsMenuItem } from '../MainMenu'
import getMessages from '../../messages'

export default function SettingsLink({ includeTitle }) {
	const dispatch = useDispatch()
	const locale = useSelector(({ settings }) => settings.settings.locale)
	const settingsMenuItem = useMemo(() => getSettingsMenuItem(), [])
	const locationPathname = useSelector(({ found }) => found.resolvedMatch.location.pathname)
	const isSettingsPage = locationPathname === settingsMenuItem.pathname
	const SettingsIcon = isSettingsPage
		? settingsMenuItem.iconActive
		: settingsMenuItem.icon
	const title = getMessages(locale).settings.title
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

