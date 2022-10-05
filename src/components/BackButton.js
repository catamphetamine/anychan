import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import classNames from 'classnames'

import useCanGoBackFromThreadToChannel from './useCanGoBackFromThreadToChannel.js'
import useMessages from '../hooks/useMessages.js'

import Button from 'frontend-lib/components/Button.js'

// import LeftArrow from 'frontend-lib/icons/left-arrow-minimal.svg'

import './BackButton.css'

export default function BackButton() {
	const messages = useMessages()
	const [canGoBack, goBack] = useCanGoBackFromThreadToChannel()
	// Not rendering the button on some pages resulted in different layout
	// on different pages, that wouldn't be optimal in terms of UX.
	// if (!canGoBack) {
	// 	return null
	// }
	return (
		<Button
			title={messages.actions.back}
			onClick={goBack}
			className={classNames('BackButton', {
				'BackButton--hidden': !canGoBack
			})}>
			<LeftArrow className="BackButtonIcon"/>
		</Button>
	)
}

function LeftArrow({ className }) {
	return (
		<div className={classNames(className, 'BackButtonIcon--leftArrow')}/>
	)
}

LeftArrow.propTypes = {
	className: PropTypes.string
}