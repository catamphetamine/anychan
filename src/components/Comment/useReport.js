import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { showReportCommentModal } from '../../redux/report.js'
import { notify } from '../../redux/notifications.js'

import useDataSource from '../../hooks/useDataSource.js'
import useMessages from '../../hooks/useMessages.js'

export default function useReport({
	channelId,
	threadId,
	commentId
}) {
	const dispatch = useDispatch()
	const dataSource = useDataSource()
	const messages = useMessages()

	const onReport = useCallback(() => {
		dispatch(showReportCommentModal({
			channelId,
			threadId,
			commentId
		}))
	}, [
		channelId,
		threadId,
		commentId
	])

	const onReportNotImplemented = useCallback(() => {
		dispatch(notify(messages.notImplementedForTheDataSource))
	}, [])

	return {
		onReport: dataSource.supportsReportComment() ? onReport : onReportNotImplemented
	}
}