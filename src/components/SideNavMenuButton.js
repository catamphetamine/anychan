import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { goBack, canGoBackInstantly } from 'react-pages'
import classNames from 'classnames'

import { isThreadLocation, isBoardLocation } from '../utility/routes'
import { showSidebar } from '../redux/app'
import getMessages from '../messages'

import LeftArrow from 'webapp-frontend/assets/images/icons/left-arrow-minimal.svg'

import './SideNavMenuButton.css'

export default function SideNavMenuButton() {
	const dispatch = useDispatch()
	const locale = useSelector(({ settings }) => settings.settings.locale)
	const _isThreadLocation = useSelector(({ found }) => isThreadLocation(found.resolvedMatch))
	const canGoBack = _isThreadLocation && window._previousLocationRouteMatch && isBoardLocation(window._previousLocationRouteMatch) && canGoBackInstantly()
	const isSidebarShown = useSelector(({ app }) => app.isSidebarShown)
	const toggleSidebar = useCallback(() => {
		if (isSidebarShown) {
			dispatch(showSidebar(false))
		} else {
			dispatch(showSidebar(true))
		}
	}, [dispatch, isSidebarShown])
	const onGoBack = useCallback(() => {
		dispatch(goBack())
	}, [dispatch])
	return (
		<button
			type="button"
			title={canGoBack ? getMessages(locale).actions.back : (isSidebarShown ? getMessages(locale).actions.close : getMessages(locale).menu)}
			onClick={canGoBack ? onGoBack : toggleSidebar}
			className="rrui__button-reset SideNavMenuButton">
			{canGoBack ?
				<LeftArrow/> :
				<MenuIcon expanded={isSidebarShown}/>
			}
		</button>
	)
}

function MenuIcon({ expanded, className }) {
	// This is to prevent the `transform` animations
	// of menu icon bars from being played on page load.
	// (when styles are included on a page via javascript)
	const activated = expanded !== undefined
	return (
		<div className={classNames(className, 'SideNavMenuButtonIcon', {
			'SideNavMenuButtonIcon--collapsed': !expanded,
			'SideNavMenuButtonIcon--expanded': expanded
		})}>
			<div className="SideNavMenuButtonIconBar"/>
			<div className="SideNavMenuButtonIconBar"/>
			<div className="SideNavMenuButtonIconBar"/>
		</div>
	)
}

MenuIcon.propTypes = {
	expanded: PropTypes.bool,
	className: PropTypes.string
}