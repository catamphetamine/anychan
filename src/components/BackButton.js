import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import classNames from 'classnames'

import { useCanGoBackFromThreadToBoard } from '../utility/routes'
import getMessages from '../messages'

// import LeftArrow from 'webapp-frontend/assets/images/icons/left-arrow-minimal.svg'

import './BackButton.css'

export default function BackButton() {
	const locale = useSelector(({ settings }) => settings.settings.locale)
	const [canGoBack, goBack] = useCanGoBackFromThreadToBoard()
	// Not rendering the button on some pages resulted in different layout
	// on different pages, that wouldn't be optimal in terms of UX.
	// if (!canGoBack) {
	// 	return null
	// }
	return (
		<button
			type="button"
			title={getMessages(locale).actions.back}
			onClick={goBack}
			className={classNames('rrui__button-reset', 'BackButton', {
				'BackButton--hidden': !canGoBack
			})}>
			<LeftArrow className="BackButtonIcon"/>
		</button>
	)
}

function LeftArrow({ className }) {
	return (
		<div className={classNames(className, 'BackButtonLeftArrow')}/>
	)
}

LeftArrow.propTypes = {
	className: PropTypes.string
}