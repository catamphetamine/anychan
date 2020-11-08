import React, { useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-pages'
import classNames from 'classnames'

import getMessages from '../../messages'
import { hideSidebar } from '../../redux/app'
import { getChan, getChanId } from '../../chan'

import ChanIcon from '../ChanIcon'
import ChanLogo from '../ChanLogo'
import { getSettingsMenuItem, getDarkModeMenuItem } from '../MainMenu'

import { Button } from 'webapp-frontend/src/components/Button'

import './SidebarMenu.css'

export default function SidebarMenu() {
	return (
		<nav className="SidebarMenu">
			<HomePageLink includeTitle/>
			<DarkModeToggle includeTitle/>
			<SettingsLink includeTitle/>
		</nav>
	)
}

export function HomePageLink({ includeTitle }) {
	const locationPathname = useSelector(({ found }) => found.resolvedMatch.location.pathname)
	const isHomePage = locationPathname === '/'
	const title = getChan().title
	return (
		<Link
			to="/"
			title={includeTitle ? undefined : title}
			className={classNames('SidebarMenuItem', 'SidebarMenuItem--logo', {
				'SidebarMenuItem--includeTitle': includeTitle,
				'SidebarMenuItem--icon': !includeTitle,
				'SidebarMenuItem--selected': isHomePage
			})}>
			{/*
			<HomePageIcon
				chanId={getChanId()}
				className="SidebarMenuItem-icon"/>
			*/}
			<SlashIcon className="SidebarMenuItem-icon"/>
			{includeTitle &&
				<span className="SidebarMenuItem-title">
					{title}
				</span>
			}
		</Link>
	)
}

HomePageLink.propTypes = {
	includeTitle: PropTypes.bool
}

function HomePageIcon({ chanId, ...rest }) {
	if (chanId === 'lainchan' || chanId === 'arisuchan') {
		return <ChanLogo {...rest}/>
	}
	return <ChanIcon {...rest}/>
}

HomePageIcon.propTypes = {
	chanId: PropTypes.string.isRequired
}

// Using `0.1` instead of `0` and `2.9` instead of `3.0` here
// to add some side padding for the `<line/>` so that it isn't clipped.
const SLASH_ICON_POINTS = '4.9,0 0.1,10'

function SlashIcon(props) {
	return (
		<svg {...props} viewBox="0 0 5 10">
			<polyline
				stroke="none"
				fill="currentColor"
				points={SLASH_ICON_POINTS}/>
				<line
					x1="0.1"
					y1="10"
					x2="4.9"
					y2="0"
					stroke="currentColor"
					strokeWidth="0.4"
					className="SidebarMenu-slashIconLine" />
		</svg>
	)
}

export function SettingsLink({ includeTitle }) {
	const dispatch = useDispatch()
	const locale = useSelector(({ settings }) => settings.settings.locale)
	const settingsMenuItem = useMemo(() => getSettingsMenuItem(), [])
	const locationPathname = useSelector(({ found }) => found.resolvedMatch.location.pathname)
	const isSettingsPage = locationPathname === settingsMenuItem.pathname
	const SettingsIcon = isSettingsPage ? settingsMenuItem.iconActive : settingsMenuItem.icon
	const title = getMessages(locale).settings.title
	return (
		<Link
			to={settingsMenuItem.url}
			title={includeTitle ? undefined : title}
			className={classNames('SidebarMenuItem', {
				'SidebarMenuItem--includeTitle': includeTitle,
				'SidebarMenuItem--icon': !includeTitle,
				'SidebarMenuItem--selected': isSettingsPage
			})}>
			<SettingsIcon className="SidebarMenuItem-icon"/>
			{includeTitle &&
				<span className="SidebarMenuItem-title">
					{title}
				</span>
			}
		</Link>
	)
}

SettingsLink.propTypes = {
	includeTitle: PropTypes.bool
}

export function DarkModeToggle({ includeTitle }) {
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
	const DarkModeIcon = darkModeMenuItem.isSelected ? darkModeMenuItem.iconActive : darkModeMenuItem.icon
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
