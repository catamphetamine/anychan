import React, { useRef, useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import ReactTimeAgo from 'react-time-ago'
import RelativeTimeFormat from 'relative-time-format'

import useAutoUpdate from './useAutoUpdate.js'

import { thread as threadType } from '../../PropTypes.js'

import useMessages from '../../hooks/useMessages.js'
import useLocale from '../../hooks/useLocale.js'

import { getThread } from '../../redux/data.js'
import getLanguageFromLocale from '../../utility/getLanguageFromLocale.js'

import Button from 'frontend-lib/components/Button.js'

import './AutoUpdate.css'

export default function AutoUpdate({ autoStart }) {
	const [isUpdating, setUpdating] = useState()
	const [isExpired, setExpired] = useState()
	const [isLocked, setLocked] = useState()
	const [error, setError] = useState()
	const [nextUpdateAt, setNextUpdateAt] = useState()
	const [secondsLeft, setSecondsLeft] = useState()

	const node = useRef()
	const messages = useMessages()

	const [refreshThread] = useAutoUpdate({
		node,
		setNextUpdateAt,
		setUpdating,
		setExpired,
		setLocked,
		setError,
		setSecondsLeft,
		autoStart
	})

	if (isExpired || isLocked) {
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
			ref={node}
			onClick={refreshThread}
			className="AutoUpdate">
			{isUpdating &&
				messages.autoUpdate.inProgress
			}
			{!isUpdating &&
				<React.Fragment>
					{error &&
						<React.Fragment>
							{messages.autoUpdate.error}
							{'. '}
						</React.Fragment>
					}
					{nextUpdateAt &&
						<AutoUpdateTimer
							secondsLeft={secondsLeft}
							nextUpdateAt={nextUpdateAt}/>
					}
					{error && '.'}
				</React.Fragment>
			}
		</Button>
	)
}

AutoUpdate.propTypes = {
	autoStart: PropTypes.bool
}

function AutoUpdateTimer({
	secondsLeft,
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
			{secondsLeft &&
				<time dateTime={nextUpdateAtISOString}>
					{relativeTimeFormat.format(secondsLeft, 'second')}
				</time>
			}
			{!secondsLeft &&
				<ReactTimeAgo
					future
					minTimeLeft={30}
					date={nextUpdateAt}
					locale={locale}
					timeStyle="round-minute"/>
			}
			{messages.autoUpdate.scheduledAfterTime}
		</React.Fragment>
	)
}

AutoUpdateTimer.propTypes = {
	secondsLeft: PropTypes.number,
	nextUpdateAt: PropTypes.number.isRequired
}