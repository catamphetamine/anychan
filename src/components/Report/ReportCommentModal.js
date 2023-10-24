import React, { useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Modal } from 'react-responsive-ui'

import { hideReportCommentModal } from '../../redux/report.js'

import ReportCommentForm from './ReportCommentForm.js'

export default function ReportModal() {
	const [isSubmitting, setSubmitting] = useState(false)

	const dispatch = useDispatch()

	const channelId = useSelector(state => state.report.channelId)
	const threadId = useSelector(state => state.report.threadId)
	const commentId = useSelector(state => state.report.commentId)
	const showReportCommentModal = useSelector(state => state.report.showReportCommentModal)

	const isOpen = showReportCommentModal

	const close = useCallback(() => {
		dispatch(hideReportCommentModal())
	}, [])

	return (
		<Modal
			isOpen={isOpen}
			close={close}
			className="GoToChannelModal"
			wait={isSubmitting}>
			<Modal.Content>
				{commentId &&
					<ReportCommentForm
						autoFocus
						setSubmitting={setSubmitting}
						onAfterSubmit={close}
						onCancel={close}
						channelId={channelId}
						threadId={threadId}
						commentId={commentId}
					/>
				}
			</Modal.Content>
		</Modal>
	)
}