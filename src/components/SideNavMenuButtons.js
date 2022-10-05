import React, { useCallback, useRef, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import classNames from 'classnames'

import useCanGoBackFromThreadToChannel from './useCanGoBackFromThreadToChannel.js'
import { showSidebar } from '../redux/app.js'
import useMessages from '../hooks/useMessages.js'

import { getViewportHeight } from 'web-browser-window'
import useOnWindowResize from 'frontend-lib/hooks/useOnWindowResize.js'
import useMount from 'frontend-lib/hooks/useMount.js'

import Button from 'frontend-lib/components/Button.js'

import './SideNavMenuButtons.css'

export default function SideNavMenuButtons() {
	const node = useRef()
	const dispatch = useDispatch()
	const messages = useMessages()

	const [canGoBack, goBack] = useCanGoBackFromThreadToChannel()

	const isSidebarShown = useSelector(state => state.app.isSidebarShown)

	const toggleSidebar = useCallback(() => {
		if (isSidebarShown) {
			dispatch(showSidebar(false))
		} else {
			dispatch(showSidebar(true))
		}
	}, [dispatch, isSidebarShown])

	const [position, setPosition] = useState()

	function updatePosition() {
		const element = node.current
		// If the component has been unmounted, then skip.
		if (!element) {
			return
		}
		const mainMenuButton = element.firstChild
		/* Setting percentage-based `top` position for `position: fixed`
		   results in it jumping when mobile browser top/bottom bars appear/disappear.
		   Instead, the `top` position is calculated and set in `px` via javascript. */
		let topOffsetPercent = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--SideNavMenuButtons-top'))
		if (isNaN(topOffsetPercent)) {
			// Happens when Webpack's `style-loader` is used in development mode.
			console.error('"--SideNavMenuButtons-top" CSS variable not initialized. This happens, for example, when Webpack\'s `style-loader` is used in development mode.')
			topOffsetPercent = 35
		}
		const position = getViewportHeight() * topOffsetPercent / 100 - mainMenuButton.offsetHeight
		setPosition(position)
		document.documentElement.style.setProperty('--SideNavMenuButtons-top--px', position + 'px')
	}

	const style = useMemo(() => ({ top: position + 'px' }), [position])

	useOnWindowResize(updatePosition, { alsoOnMount: true })

	return (
		<div
			ref={node}
			style={style}
			className="SideNavMenuButtons">
			<Button
				title={isSidebarShown ? messages.actions.close : messages.menu}
				onClick={toggleSidebar}
				className="SideNavMenuButton">
				<MenuIcon mode={isSidebarShown ? 'cross' : 'list'}/>
			</Button>
			{canGoBack &&
				<Button
					title={messages.actions.back}
					onClick={goBack}
					className="SideNavMenuButton">
					<MenuIcon mode="leftArrow"/>
				</Button>
			}
		</div>
	)
}

function MenuIcon({ mode, className }) {
	// The use of `isMounted()` in `className` is to prevent the
	// `transform` animations of menu icon bars from being played
	// on page load (when styles are included on a page via javascript).
	const [isMounted, onMount] = useMount()
	onMount()

	return (
		<div className={classNames(className, 'SideNavMenuButtonIcon', {
			'SideNavMenuButtonIcon--list': mode === 'list',
			'SideNavMenuButtonIcon--leftArrow': mode === 'leftArrow',
			'SideNavMenuButtonIcon--cross': mode === 'cross',
			'SideNavMenuButtonIcon--transition': isMounted()
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
	mode: PropTypes.oneOf([
		'list',
		'cross',
		'leftArrow'
	]).isRequired,
	className: PropTypes.string
}