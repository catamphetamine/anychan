import type { Channel, Thread, Comment } from '@/types'

import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import reportComment from '../../api/reportComment.js'

import { notify, showError } from '../../redux/notifications.js'

import { useMessages, useDataSource, useSettings, useSelector, useSubmitWithOrWithoutCaptcha } from '@/hooks'

import { AlreadyReportedError, ContentRequiredError } from "@/api/errors"

export default function useReportComment({
	channelId,
	threadId,
	commentId
}: {
	channelId: Channel['id'],
	threadId: Thread['id'],
	commentId: Comment['id']
}) {
	const dispatch = useDispatch()

	const dataSource = useDataSource()
	const userSettings = useSettings()
	const messages = useMessages()

	const accessToken = useSelector(state => state.auth.accessToken)

	const submitReport = useCallback(async ({ content, reasonId }: SubmitReportValues) => {
		try {
			// Submit the report.
			await reportComment({
				channelId,
				threadId,
				commentId,
				accessToken,
				content,
				reasonId,
				dataSource,
				userSettings
			})

			// Show a notification.
			dispatch(notify(messages.report.submitted))
		} catch (error) {
			if (error instanceof AlreadyReportedError) {
				dispatch(showError(messages.report.error.alreadyReported))
			} else if (error instanceof ContentRequiredError) {
				dispatch(showError(messages.report.error.contentRequired))
			} else {
				console.error(error)
				dispatch(showError(messages.report.error.error))
			}
		}
	}, [
		channelId,
		threadId,
		commentId,
		accessToken,
		dataSource,
		userSettings,
		messages
	])

	const onSubmit = useSubmitWithOrWithoutCaptcha({
		channelId,
		threadId,
		action: 'report-comment'
	})

	const onSubmitReport = useCallback(async (submitParameters?: Record<string, any>) => {
		await onSubmit(submitReport, submitParameters)
	}, [
		submitReport,
		onSubmit
	])

	return {
		onSubmitReport
	}
}

export interface SubmitReportValues {
	content?: string;
	reasonId?: string | number;
}