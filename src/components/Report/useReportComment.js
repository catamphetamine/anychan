import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { reportComment } from '../../redux/report.js'
import { notify, showError } from '../../redux/notifications.js'

import useMessages from '../../hooks/useMessages.js'
import useDataSource from '../../hooks/useDataSource.js'
import useSettings from '../../hooks/useSettings.js'

import AlreadyReportedError from '../../api/errors/AlreadyReportedError.js'
import ContentRequiredError from '../../api/errors/ContentRequiredError.js'

export default function useReportComment({
	channelId,
	threadId,
	commentId
}) {
	const dispatch = useDispatch()

	const dataSource = useDataSource()
	const userSettings = useSettings()
	const messages = useMessages()

	const onSubmitReport = useCallback(async ({ content }) => {
		try {
			// Submit the report.
			await dispatch(reportComment({
				channelId,
				threadId,
				commentId,
				content,
				dataSource,
				userSettings,
				messages
			}))
			// Show a notification.
			dispatch(notify(messages.report.submitted))
		} catch (error) {
			if (error instanceof AlreadyReportedError) {
				dispatch(showError(messages.report.alreadyReported))
			} else if (error instanceof ContentRequiredError) {
				dispatch(showError(messages.report.contentRequired))
			} else {
				console.error(error)
				dispatch(showError(messages.report.error))
			}
		}
	}, [
		channelId,
		threadId,
		commentId,
		dataSource,
		userSettings,
		messages
	])

	return {
		onSubmitReport
	}
}