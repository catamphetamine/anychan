import React, { useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import classNames from 'classnames'

import Button from 'frontend-lib/components/Button.js'


import 'frontend-lib/components/Button.css'

import { hideSidebar } from '../../redux/app.js'

import { getDarkModeMenuItem } from '../MainMenu.js'
import useMessages from '../../hooks/useMessages.js'

export default function DarkModeToggle({ includeTitle }) {
	const dispatch = useDispatch()
	const messages = useMessages()

	const darkMode = useSelector(state => state.app.darkMode)

	const darkModeMenuItem = useMemo(() => {
		return getDarkModeMenuItem({
			messages,
			dispatch,
			darkMode
		})
	}, [
		messages,
		dispatch,
		darkMode
	])

	const onToggleDarkMode = useCallback(() => {
		darkModeMenuItem.onClick()
		// Hide sidebar pop up on navigation (only on small screens).
		dispatch(hideSidebar())
	}, [
		dispatch,
		darkModeMenuItem
	])

	const DarkModeIcon = darkModeMenuItem.isSelected
		? darkModeMenuItem.iconActive
		: darkModeMenuItem.icon

	const title = darkModeMenuItem.title

	return (
		<Button
			onClick={onToggleDarkMode}
			title={includeTitle ? undefined : title}
			className={classNames('SidebarMenuItem', {
				'SidebarMenuItem--includeTitle': includeTitle,
				'SidebarMenuItem--icon': !includeTitle
			})}>
			<DarkModeIcon className="SidebarMenuItem-icon"/>
			{includeTitle &&
				<span className="SidebarMenuItem-title">
					{title}
				</span>
			}
		</Button>
	)
}

DarkModeToggle.propTypes = {
	includeTitle: PropTypes.bool
}
