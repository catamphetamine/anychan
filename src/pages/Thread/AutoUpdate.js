import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import ReactTimeAgo from 'react-time-ago'

import useAutoUpdate from './useAutoUpdate'

import { thread as threadType } from '../../PropTypes'

import { getThread } from '../../redux/chan'
import getMessages from '../../messages'

import './AutoUpdate.css'

const SOON_INTERVAL = 30 // in seconds

export default function AutoUpdate() {
	const [isUpdating, setUpdating] = useState()
	const [expired, setExpired] = useState()
	const [error, setError] = useState()
	const [nextUpdateAt, setNextUpdateAt] = useState()
	const [updateSoon, setUpdateSoon] = useState()
	const node = useRef()
	const locale = useSelector(({ settings }) => settings.settings.locale)
	const [refreshThread] = useAutoUpdate({
		node,
		setNextUpdateAt,
		setUpdating,
		setExpired,
		setError,
		soonInterval: SOON_INTERVAL,
		setUpdateSoon
	})
	if (expired) {
		return null
	}
	const renderRefreshTime = () => {
		return (
			<ReactTimeAgo
				future
				minTimeLeft={SOON_INTERVAL}
				date={nextUpdateAt}
				locale={locale}
				timeStyle="round"/>
		)
	}
	function renderContent() {
		if (isUpdating) {
			return (
				<React.Fragment>
					{'невидимый кружок с анимированным троеточием через FadeInOut можно здесь показывать'}
					{' '}
					{getMessages(locale).autoUpdate.inProgress}
				</React.Fragment>
			)
		}
		if (error) {
			if (updateSoon) {
				return (
					<React.Fragment>
						{'кружок-таймер "скоро" здесь показывать, с крестиком "ошибка"'}
						{' '}
						{getMessages(locale).autoUpdate.error}
						{' '}
						{getMessages(locale).autoUpdate.soon}
					</React.Fragment>
				)
			}
			return (
				<React.Fragment>
					{'кружок с крестиком "ошибка" здесь показывать'}
					{' '}
					{getMessages(locale).autoUpdate.error}
					{' '}
					{getMessages(locale).autoUpdate.scheduledBeforeTime}
					{renderRefreshTime()}
					{getMessages(locale).autoUpdate.scheduledAfterTime}
				</React.Fragment>
			)
		}
		if (nextUpdateAt) {
			if (updateSoon) {
				return (
					<React.Fragment>
						{'кружок-таймер "скоро" здесь показывать'}
						{' '}
						{getMessages(locale).autoUpdate.soon}
					</React.Fragment>
				)
			}
			return (
				<React.Fragment>
					{'иконку "refresh" здесь показывать'}
					{' '}
					{getMessages(locale).autoUpdate.scheduledBeforeTime}
					{renderRefreshTime()}
					{getMessages(locale).autoUpdate.scheduledAfterTime}
				</React.Fragment>
			)
		}
		return null
	}
	return (
		<div ref={node} className="AutoUpdate">
			{renderContent()}
		</div>
	)
}

// AutoUpdate.propTypes = {
// 	thread: threadType.isRequired
// }