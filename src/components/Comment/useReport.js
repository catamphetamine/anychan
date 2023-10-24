import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { showReportCommentModal } from '../../redux/report.js'

export default function useReport({
	channelId,
	threadId,
	commentId
}) {
	const dispatch = useDispatch()

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

	return {
		onReport
	}
}