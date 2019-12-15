import React, { useRef, useState, useCallback, useMemo, useLayoutEffect } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'react-responsive-ui'
import ReactTimeAgo from 'react-time-ago'
import IntlMessageFormat from 'intl-messageformat'

import DoubleArrowUp from 'webapp-frontend/assets/images/icons/double-arrow-up-thin.svg'

import getMessages from '../messages'

import './ShowPrevious.css'

export default function ShowPrevious({
	fromIndex,
	setFromIndex,
	items,
	pageSize,
	locale
}) {
	const showPreviousButton = useRef()
	const commentsCountMessage = useMemo(() => {
		return new IntlMessageFormat(getMessages(locale).nMoreComments, locale)
	}, [locale])
	const [hasShownPrevious, setHasShownPrevious] = useState()
	const onShowPrevious = useCallback(() => {
		setFromIndex(fromIndex > pageSize * 1.4 ? fromIndex - pageSize : 0)
	}, [setFromIndex, fromIndex, pageSize])
	const showPreviousButtonPreviousY = useRef()
	const onShowPreviousClick = useCallback(() => {
		if (hasShownPrevious) {
			onShowPrevious()
		} else {
			showPreviousButtonPreviousY.current = showPreviousButton.current.getBoundingClientRect().top
			setHasShownPrevious(true)
		}
	}, [hasShownPrevious, onShowPrevious, setHasShownPrevious])
	useLayoutEffect(() => {
		if (hasShownPrevious) {
			window.scrollTo(0, window.scrollY + (showPreviousButton.current.getBoundingClientRect().top - showPreviousButtonPreviousY.current))
			onShowPrevious()
		}
	}, [hasShownPrevious])
	const onShowAll = useCallback(() => setFromIndex(0), [setFromIndex])
	return (
		<div className="ShowPrevious">
			{hasShownPrevious &&
				<Button
					type="button"
					onClick={onShowAll}
					className="rrui__button--text ShowPreviousShowAll">
					{getMessages(locale).actions.showAll}
				</Button>
			}
			<Button
				ref={showPreviousButton}
				type="button"
				onClick={onShowPreviousClick}
				className="rrui__button--text">
				<span>
					<DoubleArrowUp className="ShowPreviousDoubleArrow"/>
					{commentsCountMessage.format({ count: fromIndex })}
				</span>
			</Button>
			<ReactTimeAgo
				date={items[fromIndex - 1].createdAt}
				locale={locale}
				tooltip={false}
				className="ShowPreviousDate"/>
		</div>
	)
}

ShowPrevious.propTypes = {
	fromIndex: PropTypes.number.isRequired,
	setFromIndex: PropTypes.func.isRequired,
	items: PropTypes.arrayOf(PropTypes.shape({
		createdAt: PropTypes.instanceOf(Date)
	})).isRequired,
	pageSize: PropTypes.number.isRequired,
	locale: PropTypes.string.isRequired
}

ShowPrevious.defaultProps = {
	pageSize: 24
}

function getRelativeTimeFormatter(locale) {
	switch (locale) {
		case 'ru':
			return TIME_AGO_RU
		default:
			return TIME_AGO_EN
	}
}