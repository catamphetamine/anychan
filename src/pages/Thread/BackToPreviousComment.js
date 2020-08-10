import React from 'react'
import PropTypes from 'prop-types'

import getMessages from '../messages'

import { Button } from 'webapp-frontend/src/components/Button'

import './BackToPreviousComment.css'

export default function BackToPreviousComment({ locale, onClick }) {
	return (
		<React.Fragment>
			<div className="BackToPreviousComment-desktop">
				<Button
					onClick={onClick}
					className="BackToPreviousComment-desktop-button rrui__button--outline">
					<LeftArrowThick strokeWidth={10} className="BackToPreviousComment-desktopArrow"/>
					{getMessages(locale).backToPreviouslyViewedComment}
				</Button>
			</div>
			<Button
				onClick={onClick}
				title={getMessages(locale).backToPreviouslyViewedComment}
				className="BackToPreviousComment-mobile">
				<LeftArrowThick strokeWidth={4} className="BackToPreviousComment-mobileArrow"/>
			</Button>
		</React.Fragment>
	)
}

BackToPreviousComment.propTypes = {
	locale: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired
}

function LeftArrowThick({ className, strokeWidth }) {
	return (
		<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className={className}>
			<line stroke="currentColor" strokeWidth={strokeWidth} x1="74.5" y1="2.25" x2="25" y2="51.75"/>
			<line stroke="currentColor" strokeWidth={strokeWidth} x1="74.5" y1="97.75" x2="25" y2="48.25"/>
		</svg>
	)
}

LeftArrowThick.propTypes = {
	strokeWidth: PropTypes.number.isRequired,
	className: PropTypes.string
}