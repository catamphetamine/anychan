import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import classNames from 'classnames'

import getUserAccountMenuItem from './getUserAccountMenuItem.js'
import SidebarMenuItem from '../Sidebar/SidebarMenuItem.js'

import useMessages from '../../hooks/useMessages.js'
import useRoute from '../../hooks/useRoute.js'
import useSelector from '../../hooks/useSelector.js'

import AnonymousIconFill from '../../../assets/images/icons/menu/person-anonymous-fill.svg'
import AnonymousIconOutline from '../../../assets/images/icons/menu/person-anonymous-outline.svg'

import './UserAccountLink.css'

export default function UserAccountLink({ withLabel }: UserAccountLinkProps) {
	const messages = useMessages()

	const accessToken = useSelector(state => state.auth.accessToken)

	const menuItem = useMemo(() => getUserAccountMenuItem({ messages }), [messages])

	const route = useRoute()
	const locationPathname = route.location.pathname

	const isCurrentUrl = locationPathname === menuItem.pathname

	const NotAuthenticatedIcon = isCurrentUrl
		? menuItem.iconSelected
		: menuItem.icon

	const AuthenticatedIcon = isCurrentUrl
		? AnonymousIconFillCustom
		: AnonymousIconOutline

	const Icon = Boolean(accessToken) ? AuthenticatedIcon : NotAuthenticatedIcon

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

interface UserAccountLinkProps {
	withLabel?: boolean
}

function AnonymousIconFillCustom({ className, ...rest }: AnonymousIconFillCustomProps) {
	return (
		<AnonymousIconFill
			{...rest}
			className={classNames(className, 'UserAccountLink-icon--anonymousFill')}
		/>
	)
}

AnonymousIconFillCustom.propTypes = {
	className: PropTypes.string
}

interface AnonymousIconFillCustomProps {
	className?: string
}