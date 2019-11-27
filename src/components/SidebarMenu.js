import React, { useMemo, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-pages'
import classNames from 'classnames'

import getMessages from '../messages'
import { addChanParameter } from '../chan'
import { hideSidebar } from '../redux/app'

import { getSettingsMenuItem, getDarkModeMenuItem } from './ApplicationMenu'

import './SidebarMenu.css'

export default function SidebarMenu() {
	const dispatch = useDispatch()
	const locale = useSelector(({ settings }) => settings.settings.locale)
	const locationPathname = useSelector(({ found }) => found.resolvedMatch.location.pathname)
	const darkMode = useSelector(({ app }) => app.darkMode)
	const settingsMenuItem = useMemo(() => getSettingsMenuItem(), [])
	const darkModeMenuItem = useMemo(() => {
		return getDarkModeMenuItem({ locale, dispatch, darkMode })
	}, [locale, dispatch, darkMode])
	const onToggleDarkMode = useCallback(() => {
		darkModeMenuItem.onClick()
		// Hide sidebar pop up on navigation (only on small screens).
		dispatch(hideSidebar())
	}, [dispatch, darkModeMenuItem])
	const DarkModeIcon = darkModeMenuItem.isSelected ? darkModeMenuItem.iconActive : darkModeMenuItem.icon
	const isSettingsPage = locationPathname === settingsMenuItem.pathname
	const SettingsIcon = isSettingsPage ? settingsMenuItem.iconActive : settingsMenuItem.icon
	return (
		<nav className="SidebarMenu">
			<Link
				to={settingsMenuItem.url}
				className={classNames('SidebarMenuItem', {
					'SidebarMenuItem--selected': isSettingsPage
				})}>
				<SettingsIcon className="SidebarMenuIcon"/>
				<span className="SidebarMenuItemTitle">
					{getMessages(locale).settings.title}
				</span>
			</Link>
			<button
				type="button"
				onClick={onToggleDarkMode}
				className={classNames('rrui__button-reset', 'SidebarMenuItem')}>
				<DarkModeIcon className="SidebarMenuIcon"/>
				<span className="SidebarMenuItemTitle">
					{darkModeMenuItem.title}
				</span>
			</button>
		</nav>
	)
}