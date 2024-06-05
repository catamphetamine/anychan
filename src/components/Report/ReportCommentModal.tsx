import React, { useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'

// @ts-expect-error
import { Modal } from 'react-responsive-ui'

import { useMessages, useSelector } from '@/hooks'

import { hideReportCommentModal } from '../../redux/report.js'

import ReportCommentForm from './ReportCommentForm.js'

export default function ReportModal() {
	const [isSubmitting, setSubmitting] = useState(false)

	const dispatch = useDispatch()
	const messages = useMessages()

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
			<Modal.Title>
				{messages.post.moreActions.report}
			</Modal.Title>
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