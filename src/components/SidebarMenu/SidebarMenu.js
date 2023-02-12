import React, { useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import classNames from 'classnames'

import HomePageLink from './HomePageLink.js'
import SettingsLink from './SettingsLink.js'
import DarkModeToggle from './DarkModeToggle.js'

import './SidebarMenu.css'

// This component is not used.

export default function SidebarMenu() {
	return (
		<nav className="SidebarMenu">
			<DarkModeToggle withLabel/>
			<SettingsLink withLabel/>
		</nav>
	)
}
