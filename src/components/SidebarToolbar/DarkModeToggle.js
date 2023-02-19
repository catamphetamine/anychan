import React, { useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import classNames from 'classnames'

import SidebarMenuItem from '../Sidebar/SidebarMenuItem.js'

import { hideSidebar } from '../../redux/app.js'

import { getDarkModeMenuItem } from '../MainMenu.js'

import useMessages from '../../hooks/useMessages.js'
import useSettings from '../../hooks/useSettings.js'

export default function DarkModeToggle({ withLabel }) {
	const dispatch = useDispatch()
	const messages = useMessages()
	const userSettings = useSettings()

	const darkMode = useSelector(state => state.app.darkMode)

	const darkModeMenuItem = useMemo(() => {
		return getDarkModeMenuItem({
			messages,
			dispatch,
			darkMode,
			userSettings
		})
	}, [
		messages,
		dispatch,
		darkMode,
		userSettings
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
		<SidebarMenuItem
			onClick={onToggleDarkMode}
			label={title}
			showLabel={withLabel}
			IconComponent={DarkModeIcon}
		/>
	)
}

DarkModeToggle.propTypes = {
	withLabel: PropTypes.bool
}
