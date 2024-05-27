import type { Thread, ChannelId, ThreadId, CommentId, EasyReactFormState, Attachment, RefreshThread } from '@/types'

import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import classNames from 'classnames'

import PostForm from '../../components/PostFormWithAttachments.js'

import useSubmitCommentOrThread from '../../hooks/useSubmitCommentOrThread.js'
import useBackground from '../../hooks/useBackground.js'

import { updateCreateCommentState, resetCreateCommentState } from '../../redux/threadPage.js'

import refreshThreadOrTimeOut from '../../utility/thread/refreshThreadOrTimeOut.js'

import { usePageStateSelector } from '@/hooks'

import {
	channelId as channelIdType,
	threadId as threadIdType
} from '../../PropTypes.js'

import './ThreadCreateComment.css'

export default function ThreadCreateComment({
	getThread,
	channelId,
	channelIsNotSafeForWork,
	threadId,
	refreshThread
}: {
	getThread: () => Thread,
	channelId: ChannelId,
	channelIsNotSafeForWork?: boolean,
	threadId: ThreadId,
	refreshThread: RefreshThread
}) {
	const background = useBackground()
	const dispatch = useDispatch()

	const createCommentState = usePageStateSelector('threadPage', state => state.threadPage.createCommentState)

	const {
		form: formState,
		formExpanded,
		formError: initialFormError,
		formInputHeight: initialFormInputHeight,
		formFiles: initialFormFiles,
		formAttachments: initialFormAttachments
	} = createCommentState || {}

	const onFormStateChange = useCallback((newState: EasyReactFormState) => {
		dispatch(updateCreateCommentState({
			form: newState
		}))
	}, [])

	const onFormErrorDidChange = useCallback((error: string) => {
		dispatch(updateCreateCommentState({
			formError: error
		}))
	}, [])

	const onFormInputHeightDidChange = useCallback((height: number) => {
		dispatch(updateCreateCommentState({
			formInputHeight: height
		}))
	}, [])

	const onFormFilesDidChange = useCallback((files: Array<{ id: number, file: File | Blob }>) => {
		dispatch(updateCreateCommentState({
			formFiles: files
		}))
	}, [])

	const onFormAttachmentsDidChange = useCallback((attachments: Attachment[]) => {
		dispatch(updateCreateCommentState({
			formAttachments: attachments
		}))
	}, [])

	const onFormExpandedChange = useCallback((expanded: boolean) => {
		if (!expanded) {
			dispatch(resetCreateCommentState())
		} else {
			dispatch(updateCreateCommentState({
				formExpanded: expanded
			}))
		}
	}, [])

	const onAfterSubmit = useCallback(async ({ commentId }: { commentId: CommentId }) => {
		// Possible scenario:
		// * User submits "Add New Comment" form.
		// * The form starts submitting.
		// * The new comment is added in the database but the HTTP response hasn't been returned yet.
		// * Thread is refreshed. The new comment is present in the refreshed thread.
		// * The HTTP response for "Add New Comment" form submission is returned.
		// * At this stage, the application shouldn't start a new thread refresh
		//   and should detect that the new comment is already present in the refreshed thread.
		const thread = getThread()
		if (thread.comments.find(_ => _.id === commentId)) {
			// The new comment is already present in the refreshed thread.
		} else {
			// Force a thread refresh.
			if (refreshThread) {
				await refreshThreadOrTimeOut({ refreshThread })
			}
		}
	}, [
		getThread,
		refreshThread
	])

	const onSubmitComment = useSubmitCommentOrThread({
		getThread,
		addSubscribedThread: true,
		channelId,
		channelIsNotSafeForWork,
		threadId,
		onAfterSubmit
	})

	const onSubmit = useCallback(async ({
		content,
		attachmentFiles
	}: {
		content?: string,
		attachmentFiles: (File | Blob)[]
	}) => {
		await onSubmitComment({ content, attachmentFiles })
	}, [
		onSubmitComment
	])

	return (
		<PostForm
			expanded={formExpanded}
			onExpandedChange={onFormExpandedChange}
			unexpandOnClose
			expandOnInteraction
			resetOnCancel
			resetAfterSubmit
			placement="comment"
			initialState={formState}
			onStateDidChange={onFormStateChange}
			initialError={initialFormError}
			onErrorDidChange={onFormErrorDidChange}
			initialInputHeight={initialFormInputHeight}
			onInputHeightDidChange={onFormInputHeightDidChange}
			initialFiles={initialFormFiles}
			onFilesDidChange={onFormFilesDidChange}
			initialAttachments={initialFormAttachments}
			onAttachmentsDidChange={onFormAttachmentsDidChange}
			onSubmit={onSubmit}
			className={classNames('ThreadCreateComment', {
				'ThreadCreateComment--notExpanded': !formExpanded,
				'ThreadCreateComment--onBackground': background
			})}
		/>
	)
}

ThreadCreateComment.propTypes = {
	getThread: PropTypes.func.isRequired,
	channelId: channelIdType.isRequired,
	channelIsNotSafeForWork: PropTypes.bool,
	threadId: threadIdType.isRequired,
	refreshThread: PropTypes.func
}