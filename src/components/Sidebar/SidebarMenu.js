import React, { useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import classNames from 'classnames'

import HomePageLink from './HomePageLink'
import SettingsLink from './SettingsLink'
import DarkModeToggle from './DarkModeToggle'

import './SidebarMenu.css'

export default function SidebarMenu() {
	return (
		<nav className="SidebarMenu">
			{/*<HomePageLink includeTitle/>*/}
			<DarkModeToggle includeTitle/>
			<SettingsLink includeTitle/>
		</nav>
	)
}
