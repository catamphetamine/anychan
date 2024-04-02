import React, { useRef, useState, useCallback, useMemo, useLayoutEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import TextButton from './TextButton.js'
import FillButton from './FillButton.js'

import useMessage from '../hooks/useMessage.js'
import useMessages from '../hooks/useMessages.js'
import useBackground from '../hooks/useBackground.js'

import DoubleArrowUp from 'frontend-lib/icons/double-arrow-up-thin.svg'

import './ShowPrevious.css'

export default function ShowPrevious({
	fromIndex,
	setFromIndex,
	items,
	pageSize,
	firstTimePageSize,
	onShowAll
}) {
	const messages = useMessages()
	const background = useBackground()

	const showPreviousButton = useRef()

	const nMoreCommentsMessageParameters = useMemo(() => ({
		count: fromIndex,
		countTag: (children) => (
			<span className="ShowPrevious-count">
				{children}
			</span>
		)
	}), [
		fromIndex
	])

	const nMoreComments = useMessage(messages.nMoreComments, nMoreCommentsMessageParameters)

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

	const ButtonComponent = background ? FillButton : TextButton

	// const onShowAll = useCallback(() => setFromIndex(0), [setFromIndex])
	return (
		<div className="ShowPrevious">
			{hasShownPrevious &&
				<ButtonComponent
					onClick={onShowAll}
					className={classNames('ShowPrevious-showAll', {
						'ShowPrevious-button--fill': background
					})}>
					{messages.actions.showAll}
				</ButtonComponent>
			}
			<ButtonComponent
				ref={showPreviousButton}
				onClick={onShowPreviousClick}
				className={classNames({
					'ShowPrevious-button--fill': background
				})}>
				<span>
					<DoubleArrowUp className="ShowPrevious-doubleArrow"/>
					{getFirstString(nMoreComments)}
					{getFirstTag(nMoreComments)}
					{getLastString(nMoreComments)}
				</span>
			</ButtonComponent>
			{/*
			<ReactTimeAgo
				date={items[fromIndex - 1].createdAt}
				locale={locale}
				tooltip={false}
				className="ShowPrevious-date"/>
			*/}
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
	onShowAll: PropTypes.func.isRequired
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