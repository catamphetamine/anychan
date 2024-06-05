import type { Thread } from '@/types'

import React, { useState, useCallback, useRef, useEffect, useMemo, ReactNode } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

// @ts-expect-error
import { Tooltip } from 'react-responsive-ui'

import CommentIcon from 'frontend-lib/icons/message-rounded-rect-square.svg'
// import FireIcon from '../../assets/images/icons/fire-outline.svg'
import FireIcon from '../../assets/images/icons/fire.svg'

import useMessage from '../hooks/useMessage.js'
import useMessages from '../hooks/useMessages.js'

import './ThreadActivityIndicator.css'
import './Tooltip.css'

const MINUTE = 60 * 1000
const FIFTEEN_MINUTES = 15 * MINUTE
const HOUR = 60 * MINUTE

export default function ThreadActivityIndicator({
	tooltipOffsetTop,
	tooltipAnchor,
	// tooltip15Min ='💬{0}/15m',
	// tooltipHour = '💬{0}/h',
	thread,
	tick = false,
	autoUpdateDelay = MINUTE,
	className,
	...rest
}: ThreadActivityIndicatorProps) {
	const mountedAt = useMemo(() => Date.now(), [])

	// Calculate counts.
	let commentsInTheLatestFifteenMinutes = 0
	let commentsInTheLatestHour = 0
	let i = thread.comments.length - 1
	const now = tick ? Date.now() : mountedAt
	while (i >= 0) {
		const createdAt = thread.comments[i].createdAt
		if (createdAt) {
			const timePassed = now - createdAt.getTime()
			if (timePassed < HOUR) {
				commentsInTheLatestHour++
				if (timePassed < FIFTEEN_MINUTES) {
					commentsInTheLatestFifteenMinutes++
				}
			} else {
				break
			}
		}
		i--
	}

	// Autoupdate.
	const [unusedState, setUnusedState] = useState<{}>()
	const forceUpdate = useCallback(() => setUnusedState({}), [setUnusedState])
	const autoUpdateTimer = useRef<number>()

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

	const messages = useMessages()

	const tooltipStatsMessageParametersFor15MinInterval = useMemo(() => {
		return getTooltipStatsMessageParameters({ count: commentsInTheLatestFifteenMinutes })
	}, [commentsInTheLatestFifteenMinutes])

	const tooltipStatsMessageParametersFor1HourInterval = useMemo(() => {
		return getTooltipStatsMessageParameters({ count: commentsInTheLatestHour })
	}, [commentsInTheLatestHour])

	const tooltipStatsFor15MinInterval = useMessage(messages.threadActivityStatsFor15MinInterval, tooltipStatsMessageParametersFor15MinInterval)
	const tooltipStatsFor1HourInterval = useMessage(messages.threadActivityStatsFor1HourInterval, tooltipStatsMessageParametersFor1HourInterval)

	const tooltipContent = useMemo(() => (
		<>
			<TooltipStats>
				{tooltipStatsFor15MinInterval}
			</TooltipStats>
			<TooltipStats>
				{tooltipStatsFor1HourInterval}
			</TooltipStats>
		</>
	), [
		tooltipStatsFor15MinInterval,
		tooltipStatsFor1HourInterval
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
			createdAt: PropTypes.instanceOf(Date)
		}))
	}),
	tick: PropTypes.bool,
	autoUpdateDelay: PropTypes.number,
	className: PropTypes.string
}

interface ThreadActivityIndicatorProps {
	tooltipOffsetTop?: number,
	tooltipAnchor?: string,
	// tooltip15Min: string,
	// tooltipHour: string,
	thread?: Thread,
	tick?: boolean,
	autoUpdateDelay?: number,
	className?: string
}

function TooltipStats({ children }: TooltipStatsProps) {
	// If `key`s weren't used, React would show a warning.
	return (
		<div className="ThreadActivityIndicatorTooltipStats">
			{children}
		</div>
	)
}

TooltipStats.propTypes = {
	children: PropTypes.node.isRequired
}

interface TooltipStatsProps {
	children: ReactNode
}

function ThreadActivityIndicatorTooltipStatsCount({ children }: ThreadActivityIndicatorTooltipStatsCountProps) {
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

interface ThreadActivityIndicatorTooltipStatsCountProps {
	children: ReactNode
}

function ThreadActivityIndicatorTooltipStatsPeriod({ children }: ThreadActivityIndicatorTooltipStatsPeriodProps) {
	return (
		<span className="ThreadActivityIndicatorTooltipStatsPeriod">
			{children}
		</span>
	)
}

ThreadActivityIndicatorTooltipStatsPeriod.propTypes = {
	children: PropTypes.node.isRequired
}

interface ThreadActivityIndicatorTooltipStatsPeriodProps {
	children: ReactNode
}

function getTooltipStatsMessageParameters({ count }: { count: number }) {
	return {
		commentsCount: count,
		commentsCountTag: (children: ReactNode) => (
			<ThreadActivityIndicatorTooltipStatsCount key="count">
				{children}
			</ThreadActivityIndicatorTooltipStatsCount>
		),
		timeTag: (children: ReactNode) => (
			<ThreadActivityIndicatorTooltipStatsPeriod key="time">
				{children}
			</ThreadActivityIndicatorTooltipStatsPeriod>
		)
	}
}