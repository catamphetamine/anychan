import React, { useCallback, useRef, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import classNames from 'classnames'

import useCanGoBackFromThreadToChannel from './useCanGoBackFromThreadToChannel.js'
import { setShowSidebar } from '../redux/app.js'

import { useSelector, useMessages } from '@/hooks'

import { getViewportHeight } from 'web-browser-window'
import useOnWindowResize from 'frontend-lib/hooks/useOnWindowResize.js'
import useIsMounted from 'frontend-lib/hooks/useIsMounted.js'

import Button from 'frontend-lib/components/Button.js'

import './SideNavMenuButtons.css'

export default function SideNavMenuButtons() {
	const dispatch = useDispatch()
	const messages = useMessages()

	const node = useRef<HTMLDivElement>()
	const [position, setPosition] = useState<number>()

	const [canGoBack, goBack] = useCanGoBackFromThreadToChannel()

	const isSidebarShown = useSelector(state => state.app.isSidebarShown)

	const toggleSidebar = useCallback(() => {
		if (isSidebarShown) {
			dispatch(setShowSidebar(false))
		} else {
			dispatch(setShowSidebar(true))
		}
	}, [dispatch, isSidebarShown])

	function updatePosition() {
		const element = node.current
		// If the component has been unmounted, then skip.
		if (!element) {
			return
		}
		const mainMenuButton = element.firstElementChild as HTMLElement
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

	useOnWindowResize(updatePosition, { alsoAfterMount: true })

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

function MenuIcon({ mode, className }: MenuIconProps) {
	// The use of `isMounted()` in `className` is to prevent the
	// `transform` animations of menu icon bars from being played
	// on page load (when styles are included on a page via javascript).
	const isMounted = useIsMounted()

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

interface MenuIconProps {
	mode:
		'list' |
		'cross' |
		'leftArrow',
	className?: string
}