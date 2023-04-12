import React, { useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import classNames from 'classnames'

import useSource from '../../hooks/useSource.js'

import HomePageLink from './HomePageLink.js'
import SettingsLink from './SettingsLink.js'
import DarkModeToggle from './DarkModeToggle.js'
import UserAccountLink from './UserAccountLink.js'

import './SidebarMenu.css'

// This component is not used.

export default function SidebarMenu() {
	const source = useSource()

	return (
		<nav className="SidebarMenu">
			<DarkModeToggle withLabel/>
			<SettingsLink withLabel/>
			{source.api.logIn &&
				<UserAccountLink withLabel/>
			}
		</nav>
	)
}
