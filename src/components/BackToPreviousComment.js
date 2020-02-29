import React from 'react'
import PropTypes from 'prop-types'

import getMessages from '../messages'

import './BackToPreviousComment.css'

export default function BackToPreviousComment({ locale, onClick }) {
	return (
		<React.Fragment>
			<div className="thread-page__back-to-previous-comment-desktop">
				<Button
					onClick={onClick}
					className="thread-page__back-to-previous-comment-desktop-button rrui__button--outline">
					<LeftArrowThick strokeWidth={10} className="thread-page__back-to-previous-comment-desktop__arrow"/>
					{getMessages(locale).backToPreviouslyViewedComment}
				</Button>
			</div>
			<button
				type="button"
				onClick={onClick}
				title={getMessages(locale).backToPreviouslyViewedComment}
				className="rrui__button-reset thread-page__back-to-previous-comment-mobile">
				<LeftArrowThick strokeWidth={4} className="thread-page__back-to-previous-comment-mobile__arrow"/>
			</button>
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