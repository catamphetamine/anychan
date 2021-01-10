import React, { useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import classNames from 'classnames'

import { Button } from 'webapp-frontend/src/components/Button'

import { hideSidebar } from '../../redux/app'

import { getDarkModeMenuItem } from '../MainMenu'

export default function DarkModeToggle({ includeTitle }) {
	const dispatch = useDispatch()
	const locale = useSelector(({ settings }) => settings.settings.locale)
	const darkMode = useSelector(({ app }) => app.darkMode)
	const darkModeMenuItem = useMemo(() => {
		return getDarkModeMenuItem({
			locale,
			dispatch,
			darkMode
		})
	}, [
		locale,
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
