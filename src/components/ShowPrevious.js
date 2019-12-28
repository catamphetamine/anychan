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
	firstTimePageSize,
	onShowAll,
	locale
}) {
	const showPreviousButton = useRef()
	const commentsCountMessage = useMemo(() => {
		return new IntlMessageFormat(getMessages(locale).nMoreComments, locale)
	}, [locale])
	const nMoreComments = useMemo(() => {
		return commentsCountMessage.formatHTMLMessage({
			count: fromIndex,
			tag: (text) => (
				<span className="ShowPreviousCount">
					{text}
				</span>
			)
		})
	}, [commentsCountMessage, fromIndex])
	const [hasShownPrevious, setHasShownPrevious] = useState()
	const onShowPrevious = useCallback((firstTime) => {
		const _pageSize = firstTime ? firstTimePageSize : pageSize
		setFromIndex(fromIndex > _pageSize * 1.4 ? fromIndex - _pageSize : 0)
	}, [
		setFromIndex,
		fromIndex,
		pageSize,
		firstTimePageSize
	])
	const showPreviousButtonPreviousY = useRef()
	const onShowPreviousClick = useCallback(() => {
		if (hasShownPrevious) {
			onShowPrevious(false)
		} else {
			showPreviousButtonPreviousY.current = showPreviousButton.current.getBoundingClientRect().top
			setHasShownPrevious(true)
		}
	}, [hasShownPrevious, onShowPrevious, setHasShownPrevious])
	useLayoutEffect(() => {
		if (hasShownPrevious) {
			window.scrollTo(0, window.scrollY + (showPreviousButton.current.getBoundingClientRect().top - showPreviousButtonPreviousY.current))
			onShowPrevious(true)
		}
	}, [hasShownPrevious])
	// const onShowAll = useCallback(() => setFromIndex(0), [setFromIndex])
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
					{getFirstString(nMoreComments)}
					{getFirstTag(nMoreComments)}
					{getLastString(nMoreComments)}
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
	firstTimePageSize: PropTypes.number.isRequired,
	onShowAll: PropTypes.func.isRequired,
	locale: PropTypes.string.isRequired
}

ShowPrevious.defaultProps = {
	pageSize: 24,
	firstTimePageSize: 12
}

function getFirstString(parts) {
	if (typeof parts[0] === 'string') {
		return parts[0]
	}
}

function getFirstTag(parts) {
	if (typeof parts[0] === 'object') {
		return parts[0]
	}
	if (typeof parts[1] === 'object') {
		return parts[1]
	}
}

function getLastString(parts) {
	if (typeof parts[1] === 'string') {
		return parts[1]
	}
	if (typeof parts[2] === 'string') {
		return parts[2]
	}
}