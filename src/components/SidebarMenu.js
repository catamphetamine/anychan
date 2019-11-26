import React, { useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-pages'
import classNames from 'classnames'

import getMessages from '../messages'
import { addChanParameter } from '../chan'

import { getDarkModeMenuItem } from './ApplicationMenu'

import SettingsIconOutline from 'webapp-frontend/assets/images/icons/menu/settings-outline.svg'
import SettingsIconFill from 'webapp-frontend/assets/images/icons/menu/settings-fill.svg'

import MoonIconOutline from 'webapp-frontend/assets/images/icons/menu/moon-outline.svg'
import MoonIconFill from 'webapp-frontend/assets/images/icons/menu/moon-fill.svg'

import './SidebarMenu.css'

export default function SidebarMenu() {
	const dispatch = useDispatch()
	const locale = useSelector(({ settings }) => settings.settings.locale)
	const locationPathname = useSelector(({ found }) => found.resolvedMatch.location.pathname)
	const darkMode = useSelector(({ app }) => app.darkMode)
	const darkModeMenuItem = useMemo(() => {
		return getDarkModeMenuItem({ locale, dispatch, darkMode })
	}, [locale, dispatch, darkMode])
	const DarkModeIcon = darkModeMenuItem.isSelected ? darkModeMenuItem.iconActive : darkModeMenuItem.icon
	const isSettingsPage = locationPathname === '/settings'
	const SettingsIcon = isSettingsPage ? SettingsIconFill : SettingsIconOutline
	return (
		<nav className="SidebarMenu">
			<Link
				to={addChanParameter('/settings')}
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
				onClick={darkModeMenuItem.onClick}
				className={classNames('rrui__button-reset', 'SidebarMenuItem')}>
				<DarkModeIcon className="SidebarMenuIcon"/>
				<span className="SidebarMenuItemTitle">
					{darkModeMenuItem.title}
				</span>
			</button>
		</nav>
	)
}