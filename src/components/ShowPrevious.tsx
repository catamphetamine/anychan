import React, { useRef, useState, useCallback, useMemo, useLayoutEffect, ReactNode } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import TextButton from './TextButton.js'
import FillButton from './FillButton.js'

import {
	useMessages,
	useMessage,
	useBackground
} from '@/hooks'

import DoubleArrowUp from 'frontend-lib/icons/double-arrow-up-thin.svg'

import './ShowPrevious.css'

export default function ShowPrevious({
	fromIndex,
	setFromIndex,
	// items,
	pageSize = 24,
	firstTimePageSize = 12,
	onShowAll
}: ShowPreviousProps) {
	const messages = useMessages()
	const background = useBackground()

	const showPreviousButton = useRef<HTMLButtonElement>()
	const showPreviousButtonPreviousY = useRef<number>()

	const [hasShownPrevious, setHasShownPrevious] = useState<boolean>()

	const nMoreCommentsMessageParameters = useMemo(() => ({
		count: fromIndex,
		countTag: (children: ReactNode) => (
			<span className="ShowPrevious-count">
				{children}
			</span>
		)
	}), [
		fromIndex
	])

	const nMoreCommentsMessage = useMessage(messages.nMoreComments, nMoreCommentsMessageParameters)

	const onShowPrevious = useCallback((firstTime: boolean) => {
		const _pageSize = firstTime ? firstTimePageSize : pageSize
		setFromIndex(fromIndex > _pageSize * 1.4 ? fromIndex - _pageSize : 0)
	}, [
		setFromIndex,
		fromIndex,
		pageSize,
		firstTimePageSize
	])

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
						'ShowPrevious-button--onBackground': background
					})}>
					{messages.actions.showAll}
				</ButtonComponent>
			}
			<ButtonComponent
				ref={showPreviousButton}
				onClick={onShowPreviousClick}
				className={classNames({
					'ShowPrevious-button--onBackground': background
				})}>
				<span>
					<DoubleArrowUp className="ShowPrevious-doubleArrow"/>
					{nMoreCommentsMessage}
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
	// items: PropTypes.arrayOf(PropTypes.shape({
	// 	createdAt: PropTypes.instanceOf(Date)
	// })).isRequired,
	pageSize: PropTypes.number,
	firstTimePageSize: PropTypes.number,
	onShowAll: PropTypes.func.isRequired
}

interface ShowPreviousProps {
	fromIndex: number,
	setFromIndex: (fromIndex: number) => void,
	pageSize?: number,
	firstTimePageSize?: number,
	onShowAll: () => void
}