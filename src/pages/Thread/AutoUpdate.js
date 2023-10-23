import React, { useRef, useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import ReactTimeAgo from 'react-time-ago'
import RelativeTimeFormat from 'relative-time-format'

import { thread as threadType } from '../../PropTypes.js'

import useMessages from '../../hooks/useMessages.js'
import useLocale from '../../hooks/useLocale.js'

import getLanguageFromLocale from '../../utility/getLanguageFromLocale.js'

import Button from 'frontend-lib/components/Button.js'

import './AutoUpdate.css'

function AutoUpdate({
	refreshThread,
	isAnyoneRefreshingThread,
	isThreadExpired,
	isThreadLocked,
	isAutoUpdateError,
	nextUpdateAt,
	secondsLeftUntilNextUpdate
}, ref) {
	const messages = useMessages()

	if (isThreadExpired || isThreadLocked) {
		return null
	}

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
		<Button
			ref={ref}
			onClick={refreshThread}
			className="AutoUpdate">
			{isAnyoneRefreshingThread &&
				messages.autoUpdate.inProgress
			}
			{!isAnyoneRefreshingThread &&
				<React.Fragment>
					{isAutoUpdateError &&
						<React.Fragment>
							{messages.autoUpdate.error}
							{'. '}
						</React.Fragment>
					}
					{nextUpdateAt &&
						<AutoUpdateTimer
							secondsLeftUntilNextUpdate={secondsLeftUntilNextUpdate}
							nextUpdateAt={nextUpdateAt}
						/>
					}
					{isAutoUpdateError && '.'}
				</React.Fragment>
			}
		</Button>
	)
}

AutoUpdate = React.forwardRef(AutoUpdate)

AutoUpdate.propTypes = {
	refreshThread: PropTypes.func.isRequired,
	isAnyoneRefreshingThread: PropTypes.bool,
	isThreadExpired: PropTypes.bool,
	isThreadLocked: PropTypes.bool,
	isAutoUpdateError: PropTypes.bool,
	nextUpdateAt: PropTypes.number,
	secondsLeftUntilNextUpdate: PropTypes.number
}

export default AutoUpdate

function AutoUpdateTimer({
	secondsLeftUntilNextUpdate,
	nextUpdateAt
}) {
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

	return (
		<React.Fragment>
			{messages.autoUpdate.scheduledBeforeTime}
			{secondsLeftUntilNextUpdate &&
				<time dateTime={nextUpdateAtISOString}>
					{relativeTimeFormat.format(secondsLeftUntilNextUpdate, 'second')}
				</time>
			}
			{!secondsLeftUntilNextUpdate &&
				<ReactTimeAgo
					future
					minTimeLeft={30}
					date={nextUpdateAt}
					locale={locale}
					timeStyle="round-minute"
				/>
			}
			{messages.autoUpdate.scheduledAfterTime}
		</React.Fragment>
	)
}

AutoUpdateTimer.propTypes = {
	secondsLeftUntilNextUpdate: PropTypes.number,
	nextUpdateAt: PropTypes.number.isRequired
}