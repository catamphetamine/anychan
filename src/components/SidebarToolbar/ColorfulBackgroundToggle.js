import React, { useState, useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import classNames from 'classnames'

import SidebarMenuItem from '../Sidebar/SidebarMenuItem.js'

import { setShowSidebar, setColorfulBackground } from '../../redux/app.js'

import getColorfulBackgroundMenuItem from './getColorfulBackgroundMenuItem.js'

import useMessages from '../../hooks/useMessages.js'
import useSettings from '../../hooks/useSettings.js'
import useMeasure from '../../hooks/useMeasure.js'

import './ColorfulBackgroundToggle.css'

export default function ColorfulBackgroundToggle({ withLabel }) {
	const dispatch = useDispatch()
	const messages = useMessages()
	const userSettings = useSettings()
	const measure = useMeasure()

	const backgroundLightMode = useSelector(state => state.app.backgroundLightMode)
	const backgroundDarkMode = useSelector(state => state.app.backgroundDarkMode)

	const [prevBackgroundLightMode, setPrevBackgroundLightMode] = useState()
	const [prevBackgroundDarkMode, setPrevBackgroundDarkMode] = useState()

	const menuItem = useMemo(() => {
		return getColorfulBackgroundMenuItem({
			messages,
			dispatch,
			measure,
			backgroundLightMode,
			backgroundDarkMode,
			prevBackgroundLightMode,
			prevBackgroundDarkMode,
			setPrevBackgroundLightMode,
			setPrevBackgroundDarkMode,
			userSettings
		})
	}, [
		messages,
		dispatch,
		backgroundLightMode,
		backgroundDarkMode,
		prevBackgroundLightMode,
		prevBackgroundDarkMode,
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
			className="ColorfulBackgroundToggle"
		/>
	)
}

ColorfulBackgroundToggle.propTypes = {
	withLabel: PropTypes.bool
}