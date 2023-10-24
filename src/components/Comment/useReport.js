import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { showReportCommentModal } from '../../redux/report.js'

import useDataSource from '../../hooks/useDataSource.js'

export default function useReport({
	channelId,
	threadId,
	commentId
}) {
	const dispatch = useDispatch()
	const dataSource = useDataSource()

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
		onReport: dataSource.id === '2ch' ? onReport : undefined
	}
}