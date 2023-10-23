import React, { useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import classNames from 'classnames'

import SidebarMenuItem from '../Sidebar/SidebarMenuItem.js'

import { setShowSidebar, setColorfulBackground } from '../../redux/app.js'

import getColorfulBackgroundMenuItem from './getColorfulBackgroundMenuItem.js'

import useMessages from '../../hooks/useMessages.js'
import useSettings from '../../hooks/useSettings.js'
import useMeasure from '../../hooks/useMeasure.js'

export default function ColorfulBackgroundToggle({ withLabel }) {
	const dispatch = useDispatch()
	const messages = useMessages()
	const userSettings = useSettings()
	const measure = useMeasure()

	const colorfulBackground = useSelector(state => state.app.colorfulBackground)

	const menuItem = useMemo(() => {
		return getColorfulBackgroundMenuItem({
			messages,
			dispatch,
			measure,
			colorfulBackground,
			userSettings
		})
	}, [
		messages,
		dispatch,
		colorfulBackground,
		userSettings
	])

	const onToggle = useCallback(() => {
		menuItem.onClick()
		// Hide sidebar when toggling the switch (only on small screens).
		dispatch(setShowSidebar(false))
	}, [
		dispatch,
		menuItem
	])

	const Icon = menuItem.isSelected
		? menuItem.iconSelected
		: menuItem.icon

	const title = menuItem.title

	return (
		<SidebarMenuItem
			onClick={onToggle}
			label={title}
			showLabel={withLabel}
			IconComponent={Icon}
		/>
	)
}

ColorfulBackgroundToggle.propTypes = {
	withLabel: PropTypes.bool
}