import React, { useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import classNames from 'classnames'

import SidebarMenuItem from '../Sidebar/SidebarMenuItem.js'

import { setShowSidebar } from '../../redux/app.js'

import getDarkModeMenuItem from './getDarkModeMenuItem.js'

import useMessages from '../../hooks/useMessages.js'
import useSettings from '../../hooks/useSettings.js'
import useMeasure from '../../hooks/useMeasure.js'

export default function DarkModeToggle({ withLabel }) {
	const dispatch = useDispatch()
	const messages = useMessages()
	const userSettings = useSettings()
	const measure = useMeasure()

	const darkMode = useSelector(state => state.app.darkMode)

	const darkModeMenuItem = useMemo(() => {
		return getDarkModeMenuItem({
			messages,
			dispatch,
			measure,
			darkMode,
			userSettings
		})
	}, [
		messages,
		dispatch,
		darkMode,
		userSettings
	])

	const onToggle = useCallback(() => {
		darkModeMenuItem.onClick()
		// Hide sidebar when toggling the switch (only on small screens).
		dispatch(setShowSidebar(false))
	}, [
		dispatch,
		darkModeMenuItem
	])

	const Icon = darkModeMenuItem.isSelected
		? darkModeMenuItem.iconSelected
		: darkModeMenuItem.icon

	const title = darkModeMenuItem.title

	return (
		<SidebarMenuItem
			onClick={onToggle}
			label={title}
			showLabel={withLabel}
			IconComponent={Icon}
		/>
	)
}

DarkModeToggle.propTypes = {
	withLabel: PropTypes.bool
}
