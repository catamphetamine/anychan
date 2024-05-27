import type { RefreshThread } from '@/types'

import React, { useMemo } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import ReactTimeAgo from 'react-time-ago'
import RelativeTimeFormat from 'relative-time-format'

import {
	useMessages,
	useMessage,
	useLocale,
	useBackground
 } from '@/hooks'

import getLanguageFromLocale from '../../utility/getLanguageFromLocale.js'

import Button from 'frontend-lib/components/Button.js'
import FillButton from '../../components/FillButton.js'

import './AutoUpdate.css'

const AutoUpdate = React.forwardRef<HTMLButtonElement, AutoUpdateProps>(({
	refreshThread,
	isAnyoneRefreshingThread,
	isThreadExpired,
	isThreadLocked,
	isAutoUpdateError,
	nextUpdateAt,
	secondsLeftUntilNextUpdate
}, ref) => {
	const messages = useMessages()
	const background = useBackground()

	const ButtonComponent = background ? FillButton : Button

	const isAutoUpdateScheduled = typeof nextUpdateAt === 'number'

	// If the thread has expired or is locked, there's no need to auto-update anything.
	if (isThreadExpired || isThreadLocked) {
		return null
	}

	// The contents of the `.AutoUpdate-button` element.
	// When no auto-update is scheduled, an empty `.AutoUpdate-button` element should still be rendered
	// in order to (re)trigger "start/resume auto-update on scroll-to" event listener.
	const autoUpdateContents = isAutoUpdateScheduled ? (
		isAnyoneRefreshingThread ? (
			messages.autoUpdate.inProgress
		) : (
			<AutoUpdateTimer
				secondsLeftUntilNextUpdate={secondsLeftUntilNextUpdate}
				nextUpdateAt={nextUpdateAt}
			/>
		)
	) : null

	// The `<Button/>` used here is a "simpler" one:
	// it doesn't wait for the `onClick()` `Promise`
	// and doesn't show a "wait" status indicator.
	// That's intentional, so that the `<Button/>`
	// doesn't disable itself while refreshing the thread:
	// otherwise, the focus would be lost due to the disabling.
	// It could have used `keepFocus` flag to re-focus after
	// the `Promise` finishes, but that would result in a page
	// scroll "jumping" because re-focusing a `<button/>` that's
	// off-screen would make the browser scroll to it automatically.
	return (
		<div className={classNames('AutoUpdate', {
			'AutoUpdate--onBackground': background
		})}>
			{isAutoUpdateError &&
				<div className={classNames('AutoUpdate-error', {
					'AutoUpdate-error--onBackground': background
				})}>
					{messages.autoUpdate.error}
				</div>
			}
			<ButtonComponent
				ref={ref}
				onClick={refreshThread}
				className={classNames('AutoUpdate-button', {
					// When no auto-update is scheduled, an empty `.AutoUpdate-button` element should still be rendered
					// in order to (re)trigger "start/resume auto-update on scroll-to" event listener.
					'AutoUpdate-button--empty': !autoUpdateContents
				})}>
				{autoUpdateContents}
			</ButtonComponent>
		</div>
	)
})

AutoUpdate.propTypes = {
	refreshThread: PropTypes.func.isRequired,
	isAnyoneRefreshingThread: PropTypes.bool,
	isThreadExpired: PropTypes.bool,
	isThreadLocked: PropTypes.bool,
	isAutoUpdateError: PropTypes.bool,
	nextUpdateAt: PropTypes.number,
	secondsLeftUntilNextUpdate: PropTypes.number
}

interface AutoUpdateProps {
	refreshThread: RefreshThread,
	isAnyoneRefreshingThread?: boolean,
	isThreadExpired?: boolean,
	isThreadLocked?: boolean,
	isAutoUpdateError?: boolean,
	nextUpdateAt?: number
	secondsLeftUntilNextUpdate?: number
}

export default AutoUpdate

function AutoUpdateTimer({
	secondsLeftUntilNextUpdate,
	nextUpdateAt
}: AutoUpdateTimerProps) {
	const messages = useMessages()
	const locale = useLocale()

	const relativeTimeFormat = useMemo(() => {
		return new RelativeTimeFormat(getLanguageFromLocale(locale), {
		  style: 'long'
		})
	}, [locale])

	const nextUpdateAtISOString = useMemo(() => {
		return new Date(nextUpdateAt).toISOString()
	}, [nextUpdateAt])

	const scheduledMessageParameters = useMemo(() => ({
		timeRelative: () => (
			secondsLeftUntilNextUpdate ? (
				<time dateTime={nextUpdateAtISOString}>
					{relativeTimeFormat.format(secondsLeftUntilNextUpdate, 'second')}
				</time>
			) : (
				<ReactTimeAgo
					future
					minTimeLeft={30}
					date={nextUpdateAt}
					locale={locale}
					timeStyle="round-minute"
				/>
			)
		)
	}), [
		secondsLeftUntilNextUpdate,
		nextUpdateAtISOString,
		nextUpdateAt,
		locale
	])

	const scheduledMessage = useMessage(messages.autoUpdate.scheduled, scheduledMessageParameters)

	return scheduledMessage
}

AutoUpdateTimer.propTypes = {
	secondsLeftUntilNextUpdate: PropTypes.number,
	nextUpdateAt: PropTypes.number.isRequired
}

interface AutoUpdateTimerProps {
	secondsLeftUntilNextUpdate?: number,
	nextUpdateAt: number
}