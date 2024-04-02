import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import classNames from 'classnames'

import PostForm from '../../components/PostFormWithAttachments.js'

import useMessages from '../../hooks/useMessages.js'
import useSubmitCommentOrThread from '../../hooks/useSubmitCommentOrThread.js'
import useBackground from '../../hooks/useBackground.js'

import { updateCreateCommentState, resetCreateCommentState } from '../../redux/thread.js'

import {
	channelId as channelIdType,
	threadId as threadIdType
} from '../../PropTypes.js'

import './ThreadCreateComment.css'

export default function ThreadCreateComment({
	channelId,
	channelIsNotSafeForWork,
	threadId,
	refreshThread
}) {
	const messages = useMessages()
	const background = useBackground()
	const dispatch = useDispatch()

	const createCommentState = useSelector(state => state.thread.createCommentState)

	const {
		form: formState,
		formExpanded,
		formError: initialFormError,
		formInputHeight: initialFormInputHeight,
		formFiles: initialFormFiles,
		formAttachments: initialFormAttachments
	} = createCommentState || {}

	const onFormStateChange = useCallback((newState) => {
		dispatch(updateCreateCommentState({
			form: newState
		}))
	}, [])

	const onFormErrorDidChange = useCallback((error) => {
		dispatch(updateCreateCommentState({
			formError: error
		}))
	}, [])

	const onFormInputHeightDidChange = useCallback((height) => {
		dispatch(updateCreateCommentState({
			formInputHeight: height
		}))
	}, [])

	const onFormFilesDidChange = useCallback((files) => {
		dispatch(updateCreateCommentState({
			formFiles: files
		}))
	}, [])

	const onFormAttachmentsDidChange = useCallback((attachments) => {
		dispatch(updateCreateCommentState({
			formAttachments: attachments
		}))
	}, [])

	const onFormExpandedChange = useCallback((expanded) => {
		if (!expanded) {
			dispatch(resetCreateCommentState())
		} else {
			dispatch(updateCreateCommentState({
				formExpanded: expanded
			}))
		}
	}, [])

	const onAfterSubmit = useCallback(({ id }) => {
		// dispatch(dispatch(updateCreateCommentState({
		// 	formExpanded: false
		// })))
		if (refreshThread) {
			refreshThread()
		}
	}, [
		refreshThread
	])

	const onSubmitComment = useSubmitCommentOrThread({
		channelId,
		channelIsNotSafeForWork,
		threadId,
		onAfterSubmit
	})

	const onSubmit = useCallback(async ({
		content,
		attachmentFiles
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
	channelId: channelIdType.isRequired,
	channelIsNotSafeForWork: PropTypes.bool,
	threadId: threadIdType.isRequired,
	refreshThread: PropTypes.func
}