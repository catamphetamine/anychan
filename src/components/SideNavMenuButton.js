import React, { useCallback, useRef, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import classNames from 'classnames'

import { useCanGoBackFromThreadToBoard } from '../utility/routes'
import { showSidebar } from '../redux/app'
import getMessages from '../messages'

import { getViewportHeight } from 'webapp-frontend/src/utility/dom'
import onWindowResize from 'webapp-frontend/src/hooks/onWindowResize'

import { Button } from 'webapp-frontend/src/components/Button'

import './SideNavMenuButton.css'

export default function SideNavMenuButton() {
	const node = useRef()
	const dispatch = useDispatch()
	const locale = useSelector(({ settings }) => settings.settings.locale)
	const [canGoBack, goBack] = useCanGoBackFromThreadToBoard()
	const isSidebarShown = useSelector(({ app }) => app.isSidebarShown)
	const toggleSidebar = useCallback(() => {
		if (isSidebarShown) {
			dispatch(showSidebar(false))
		} else {
			dispatch(showSidebar(true))
		}
	}, [dispatch, isSidebarShown])
	const [position, setPosition] = useState()
	function updatePosition() {
		/* Setting percentage-based `top` position for `position: fixed`
		   results in it jumping when mobile browser top/bottom bars appear/disappear.
		   Instead, the `top` position is calculated and set in `px` via javascript. */
		let topOffsetPercent = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--SideNavMenuButton-top'))
		if (isNaN(topOffsetPercent)) {
			// Happens when Webpack's `style-loader` is used in development mode.
			console.error('"--SideNavMenuButton-top" CSS variable not initialized. This happens, for example, when Webpack\'s `style-loader` is used in development mode.')
			topOffsetPercent = 35
		}
		const position = getViewportHeight() * topOffsetPercent / 100 - node.current.offsetHeight
		setPosition(position)
		document.documentElement.style.setProperty('--SideNavMenuButton-top--px', position + 'px')
	}
	const style = useMemo(() => ({ top: position + 'px' }), [position])
	onWindowResize(updatePosition, { alsoOnMount: true })
	return (
		<Button
			ref={node}
			title={canGoBack ? getMessages(locale).actions.back : (isSidebarShown ? getMessages(locale).actions.close : getMessages(locale).menu)}
			onClick={canGoBack ? goBack : toggleSidebar}
			style={style}
			className="SideNavMenuButton">
			<MenuIcon mode={canGoBack ? 'leftArrow' : (isSidebarShown ? 'cross' : 'menu')}/>
		</Button>
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
			<div className="SideNavMenuButtonIcon-bar"/>
			<div className="SideNavMenuButtonIcon-bar"/>
			<div className="SideNavMenuButtonIcon-bar"/>
			<div className="SideNavMenuButtonIcon-bar"/>
			<div className="SideNavMenuButtonIcon-bar"/>
			<div className="SideNavMenuButtonIcon-bar"/>
		</div>
	)
}

MenuIcon.propTypes = {
	mode: PropTypes.oneOf(['menu', 'cross', 'leftArrow']),
	className: PropTypes.string
}