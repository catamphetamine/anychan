import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import classNames from 'classnames'

import getUserAccountMenuItem from './getUserAccountMenuItem.js'
import SidebarMenuItem from '../Sidebar/SidebarMenuItem.js'

import useMessages from '../../hooks/useMessages.js'
import useRoute from '../../hooks/useRoute.js'

export default function UserAccountLink({ withLabel }) {
	const dispatch = useDispatch()
	const messages = useMessages()

	const menuItem = useMemo(() => getUserAccountMenuItem({ messages }), [messages])

	const route = useRoute()
	const locationPathname = route.location.pathname

	const isCurrentUrl = locationPathname === menuItem.pathname

	const Icon = isCurrentUrl
		? menuItem.iconActive
		: menuItem.icon

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

UserAccountLink.propTypes = {
	withLabel: PropTypes.bool
}

