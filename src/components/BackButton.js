import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import classNames from 'classnames'

import useCanGoBackFromThreadToChannel from './useCanGoBackFromThreadToChannel.js'
import useMessages from '../hooks/useMessages.js'

import Button from 'frontend-lib/components/Button.js'

// import LeftArrow from 'frontend-lib/icons/left-arrow-minimal.svg'

import './BackButton.css'

const BackButton = React.forwardRef(({
	syncWithButton,
	placement
}, ref) => {
	const messages = useMessages()

	const onPointerDown = useCallback(() => {
		if (syncWithButton) {
			syncWithButton.current.classList.add('BackButton--active')
		}
	}, [syncWithButton])

	const onPointerUp = useCallback(() => {
		if (syncWithButton) {
			syncWithButton.current.classList.remove('BackButton--active')
		}
	}, [syncWithButton])

	const onPointerIn = useCallback(() => {
		if (syncWithButton) {
			syncWithButton.current.classList.add('BackButton--hover')
		}
	}, [syncWithButton])

	const onPointerOut = useCallback(() => {
		if (syncWithButton) {
			syncWithButton.current.classList.remove('BackButton--active')
			syncWithButton.current.classList.remove('BackButton--hover')
		}
	}, [syncWithButton])

	const onTouchStart = useCallback((event) => {
		if (event.touches.length === 1) {
			// Don't add the `--active` class on touch
			// because the user is not necessarily intending to click the button.
			// The user might just be scrolling using touch.
			// onPointerDown()
		} else {
			// Reset on multitouch.
			onPointerOut()
		}
	}, [
		onPointerDown,
		onPointerOut
	])

	const [canGoBack, goBack] = useCanGoBackFromThreadToChannel()

	// Not rendering the button on some pages resulted in different layout
	// on different pages, that wouldn't be optimal in terms of UX.
	// if (!canGoBack) {
	// 	return null
	// }

	return (
		<Button
			ref={ref}
			aria-label={messages.actions.back}
			onClick={goBack}
			onMouseDown={onPointerDown}
			onMouseUp={onPointerUp}
			onTouchStart={onTouchStart}
			onTouchEnd={onPointerUp}
			onTouchMove={onPointerOut}
			onTouchCancel={onPointerUp}
			onMouseEnter={onPointerIn}
			onMouseLeave={onPointerOut}
			onDragStart={onPointerOut}
			className={classNames('BackButton', {
				'BackButton--hidden': !canGoBack,
				'BackButton--paddingLeft': placement === 'paddingLeft',
				'BackButton--content': placement === 'content',
				'BackButton--aboveContent': placement === 'aboveContent'
			})}>
			<LeftArrow className="BackButtonIcon"/>
		</Button>
	)
})

BackButton.propTypes = {
	placement: PropTypes.oneOf(['paddingLeft', 'content', 'aboveContent']).isRequired,
	syncWithButton: PropTypes.shape({
		current: PropTypes.any
	})
}

export default BackButton

function LeftArrow({ className }) {
	return (
		<div className={classNames(className, 'BackButtonIcon--leftArrow')}/>
	)
}

LeftArrow.propTypes = {
	className: PropTypes.string
}