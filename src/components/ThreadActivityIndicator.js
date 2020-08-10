import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { Tooltip } from 'react-responsive-ui'
import classNames from 'classnames'
import IntlMessageFormat from 'intl-messageformat'

import CommentIcon from 'webapp-frontend/assets/images/icons/message-rounded-rect-square.svg'
// import FireIcon from '../../assets/images/icons/fire-outline.svg'
import FireIcon from '../../assets/images/icons/fire.svg'

import getMessages from '../messages'

import './ThreadActivityIndicator.css'
import './Tooltip.css'

const MINUTE = 60 * 1000
const FIFTEEN_MINUTES = 15 * MINUTE
const HOUR = 60 * MINUTE

export default function ThreadActivityIndicator({
	tooltipOffsetTop,
	tooltipAnchor,
	// tooltip15Min,
	// tooltipHour,
	thread,
	tick,
	autoUpdateDelay,
	className,
	...rest
}) {
	const mountedAt = useMemo(() => Date.now(), [])
	const locale = useSelector(({ settings }) => settings.settings.locale)
	// Calculate counts.
	let commentsInTheLatestFifteenMinutes = 0
	let commentsInTheLatestHour = 0
	let i = thread.comments.length - 1
	const now = tick ? Date.now() : mountedAt
	while (i >= 0) {
		const createdAt = thread.comments[i].createdAt
		const timePassed = now - createdAt
		if (timePassed < HOUR) {
			commentsInTheLatestHour++
			if (timePassed < FIFTEEN_MINUTES) {
				commentsInTheLatestFifteenMinutes++
			}
		} else {
			break
		}
		i--
	}
	// Autoupdate.
	const [unusedState, setUnusedState] = useState()
	const forceUpdate = useCallback(() => setUnusedState({}), [setUnusedState])
	const autoUpdateTimer = useRef()
	const scheduleNextTick = useCallback(() => {
		// Register for the relative time autoupdate as the time goes by.
		autoUpdateTimer.current = setTimeout(() => {
			forceUpdate()
			scheduleNextTick()
		}, autoUpdateDelay)
	}, [
		forceUpdate,
		autoUpdateDelay
	])
	useEffect(() => {
		scheduleNextTick()
		return () => {
			clearTimeout(autoUpdateTimer.current)
		}
	}, [])
	// Render.
	const {
		threadActivityStatus15Min,
		threadActivityStatusHour
	} = getMessages(locale)
	const tooltip15Min = useMemo(() => {
		return new IntlMessageFormat(threadActivityStatus15Min, locale)
	}, [
		threadActivityStatus15Min,
		locale
	])
	const tooltipHour = useMemo(() => {
		return new IntlMessageFormat(threadActivityStatusHour, locale)
	}, [
		threadActivityStatusHour,
		locale
	])
	const tooltipContent = useMemo(() => (
		<React.Fragment>
			<TooltipStats
				tooltip={tooltip15Min}
				count={commentsInTheLatestFifteenMinutes}/>
			<TooltipStats
				tooltip={tooltipHour}
				count={commentsInTheLatestHour}/>
		</React.Fragment>
	), [
		tooltip15Min,
		tooltipHour,
		commentsInTheLatestFifteenMinutes,
		commentsInTheLatestHour
	])
	const isHot = commentsInTheLatestFifteenMinutes > 10
	if (commentsInTheLatestHour === 0) {
		return null
	}
	return (
		<Tooltip
			{...rest}
			offsetTop={tooltipOffsetTop}
			placement={tooltipAnchor}
  		content={tooltipContent}
			tooltipClassName="ThreadActivityIndicatorTooltip Tooltip Tooltip--large"
			className={classNames(className, 'ThreadActivityIndicator', {
				'ThreadActivityIndicator--hot': isHot,
				'ThreadActivityIndicator--active': commentsInTheLatestFifteenMinutes > 0,
				'ThreadActivityIndicator--idle': commentsInTheLatestFifteenMinutes === 0 && commentsInTheLatestHour > 0,
				'ThreadActivityIndicator--off': commentsInTheLatestHour === 0
			})}>
			{isHot &&
				<FireIcon className="ThreadActivityIndicator-hot"/>
			}
		</Tooltip>
	)
}

ThreadActivityIndicator.propTypes = {
	tooltipOffsetTop: PropTypes.number,
	tooltipAnchor: PropTypes.string,
	// tooltip15Min: PropTypes.string.isRequired,
	// tooltipHour: PropTypes.string.isRequired,
	thread: PropTypes.shape({
		comments: PropTypes.arrayOf(PropTypes.shape({
			createdAt: PropTypes.number.isRequired
		}))
	}),
	tick: PropTypes.bool,
	autoUpdateDelay: PropTypes.number.isRequired,
	className: PropTypes.string
}

ThreadActivityIndicator.defaultProps = {
	// tooltip15Min: '💬{0}/15m',
	// tooltipHour: '💬{0}/h',
	autoUpdateDelay: MINUTE
}

function TooltipStats({ tooltip, count }) {
	// If `key`s weren't used, React would show a warning.
	return (
		<div className="ThreadActivityIndicatorTooltipStats">
			{tooltip.format({
				_count: count,
				count: (children) => (
					<ThreadActivityIndicatorTooltipStatsCount key="theCount">
						{children}
					</ThreadActivityIndicatorTooltipStatsCount>
				),
				time: (children) => (
					<ThreadActivityIndicatorTooltipStatsPeriod key="theTime">
						{children}
					</ThreadActivityIndicatorTooltipStatsPeriod>
				)
			})}
		</div>
	)
}

TooltipStats.propTypes = {
	tooltip: PropTypes.shape({
		format: PropTypes.func.isRequired
	}).isRequired,
	count: PropTypes.number.isRequired
}

function ThreadActivityIndicatorTooltipStatsCount({ children }) {
	return (
		<span className="ThreadActivityIndicatorTooltipStatsCount">
			<CommentIcon className="ThreadActivityIndicatorTooltipStatsCommentIcon"/>
			{children}
		</span>
	)
}

ThreadActivityIndicatorTooltipStatsCount.propTypes = {
	children: PropTypes.node.isRequired
}

function ThreadActivityIndicatorTooltipStatsPeriod({ children }) {
	return (
		<span className="ThreadActivityIndicatorTooltipStatsPeriod">
			{children}
		</span>
	)
}

ThreadActivityIndicatorTooltipStatsPeriod.propTypes = {
	children: PropTypes.node.isRequired
}