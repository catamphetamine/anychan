import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import getSettingsMenuItem from './getSettingsMenuItem.js'
import SidebarMenuItem from '../Sidebar/SidebarMenuItem.js'

import useMessages from '../../hooks/useMessages.js'
import useRoute from '../../hooks/useRoute.js'

export default function SettingsLink({ withLabel }: SettingsLinkProps) {
	const messages = useMessages()

	const menuItem = useMemo(() => getSettingsMenuItem({ messages }), [messages])

	const route = useRoute()
	const locationPathname = route.location.pathname

	const isCurrentUrl = locationPathname === menuItem.pathname

	const Icon = isCurrentUrl
		? menuItem.iconSelected
		: menuItem.icon

	const title = messages.settings.title

	return (
		<SidebarMenuItem
			link={menuItem.url}
			label={menuItem.title}
			showLabel={withLabel}
			selected={isCurrentUrl}
			IconComponent={Icon}
		/>
	)
}

SettingsLink.propTypes = {
	withLabel: PropTypes.bool
}

interface SettingsLinkProps {
	withLabel?: boolean
}
