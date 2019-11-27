import React, { useCallback, useRef, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { goBack, canGoBackInstantly } from 'react-pages'
import classNames from 'classnames'

import { isThreadLocation, isBoardLocation } from '../utility/routes'
import { showSidebar } from '../redux/app'
import getMessages from '../messages'

import { getViewportHeight } from 'webapp-frontend/src/utility/dom'
import onWindowResize from 'webapp-frontend/src/hooks/onWindowResize'

import './SideNavMenuButton.css'

export default function SideNavMenuButton() {
	const node = useRef()
	const dispatch = useDispatch()
	const locale = useSelector(({ settings }) => settings.settings.locale)
	const _isThreadLocation = useSelector(({ found }) => isThreadLocation(found.resolvedMatch))
	const canGoBack = _isThreadLocation && window._previousRoute && isBoardLocation(window._previousRoute) && canGoBackInstantly()
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
	const [position, setPosition] = useState()
	function updatePosition() {
		/* Setting percentage-based `top` position for `position: fixed`
		   results in it jumping when mobile browser top/bottom bars appear/disappear.
		   Instead, the `top` position is calculated and set in `px` via javascript. */
		const topOffsetPercent = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--SideNavMenuButton-top'))
		setPosition(getViewportHeight() * topOffsetPercent / 100 - node.current.offsetHeight)
	}
	const style = useMemo(() => ({ top: position + 'px' }), [position])
	onWindowResize(updatePosition, { alsoOnMount: true })
	return (
		<button
			ref={node}
			type="button"
			title={canGoBack ? getMessages(locale).actions.back : (isSidebarShown ? getMessages(locale).actions.close : getMessages(locale).menu)}
			onClick={canGoBack ? onGoBack : toggleSidebar}
			style={style}
			className="rrui__button-reset SideNavMenuButton">
			<MenuIcon mode={canGoBack ? 'leftArrow' : (isSidebarShown ? 'cross' : 'menu')}/>
		</button>
	)
}

function MenuIcon({ mode, className }) {
	// This is to prevent the `transform` animations
	// of menu icon bars from being played on page load.
	// (when styles are included on a page via javascript)
	const isMounted = useRef()
	useEffect(() => {
		isMounted.current = true
	}, [])
	return (
		<div className={classNames(className, 'SideNavMenuButtonIcon', {
			'SideNavMenuButtonIcon--leftArrow': mode === 'leftArrow',
			'SideNavMenuButtonIcon--cross': mode === 'cross',
			'SideNavMenuButtonIcon--transition': isMounted.current
		})}>
			<div className="SideNavMenuButtonIconBar"/>
			<div className="SideNavMenuButtonIconBar"/>
			<div className="SideNavMenuButtonIconBar"/>
			<div className="SideNavMenuButtonIconBar"/>
			<div className="SideNavMenuButtonIconBar"/>
			<div className="SideNavMenuButtonIconBar"/>
		</div>
	)
}

MenuIcon.propTypes = {
	mode: PropTypes.oneOf(['menu', 'cross', 'leftArrow']),
	className: PropTypes.string
}