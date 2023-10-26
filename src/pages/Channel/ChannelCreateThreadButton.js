import React, { useCallback, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'

import PostForm from '../../components/PostForm.js'

import { channelId as channelIdType } from '../../PropTypes.js'

import TextButton from '../../components/TextButton.js'

import useMessages from '../../hooks/useMessages.js'
import useSubmitCommentOrThread from '../../hooks/useSubmitCommentOrThread.js'

import useEffectSkipMount from 'frontend-lib/hooks/useEffectSkipMount.js'

import { updateCreateThreadState, resetCreateThreadState } from '../../redux/channel.js'
import { showError } from '../../redux/notifications.js'

import './ChannelCreateThreadButton.css'

export default function ChannelCreateThreadButton({
	channelId,
	channelIsNotSafeForWork
}) {
	const [showCreateThreadForm, setShowCreateThreadForm] = useState(false)

	const messages = useMessages()
	const dispatch = useDispatch()

	const form = useRef()
	const createThreadButton = useRef()

	const createThreadState = useSelector(state => state.channel.createThreadState)

	const {
		showForm,
		form: formState,
		formError: initialFormError,
		formInputHeight: initialFormInputHeight,
		formFiles: initialFormFiles,
		formAttachments: initialFormAttachments
	} = createThreadState || {}

	const onFormStateChange = useCallback((newState) => {
		dispatch(updateCreateThreadState({
			form: newState
		}))
	}, [])

	const onFormErrorDidChange = useCallback((error) => {
		dispatch(updateCreateThreadState({
			formError: error
		}))
	}, [])

	const onFormInputHeightDidChange = useCallback((height) => {
		dispatch(updateCreateThreadState({
			formInputHeight: height
		}))
	}, [])

	const onFormFilesDidChange = useCallback((files) => {
		dispatch(updateCreateThreadState({
			formFiles: files
		}))
	}, [])

	const onFormAttachmentsDidChange = useCallback((attachments) => {
		dispatch(updateCreateThreadState({
			formAttachments: attachments
		}))
	}, [])

	const onShowForm = useCallback(() => {
		dispatch(updateCreateThreadState({
			showForm: true
		}))
	}, [])

	const onCancelCreateThread = useCallback(() => {
		dispatch(resetCreateThreadState())
	}, [])

	const onAfterSubmit = useCallback(({ id }) => {
		dispatch(resetCreateThreadState())
		if (id) {
			dispatch(goto(`/${channelId}/${id}`))
		} else {
			dispatch(showError('Thread ID not found in server response'))
		}
	}, [
		channelId
	])

	const onSubmitThread = useSubmitCommentOrThread({
		channelId,
		channelIsNotSafeForWork,
		onAfterSubmit
	})

	const onSubmit = useCallback(async ({
		content,
		attachmentFiles
	}) => {
		await onSubmitThread({ content, attachmentFiles })
	}, [
		onSubmitThread
	])

	useEffectSkipMount(() => {
		if (showForm) {
			form.current.focus()
		} else {
			if (createThreadButton.current) {
				createThreadButton.current.focus()
			}
		}
	}, [showForm])

	return (
		<div className="ChannelCreateThreadButton-container">
			{!showForm &&
				<TextButton
					ref={createThreadButton}
					onClick={onShowForm}
					className="ChannelCreateThreadButton">
					{messages.createThread}
				</TextButton>
			}
			{showForm &&
				<PostForm
					ref={form}
					expanded
					placement="page"
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
					onCancel={onCancelCreateThread}
					onSubmit={onSubmit}
				/>
			}
		</div>
	)
}

ChannelCreateThreadButton.propTypes = {
	channelId: channelIdType.isRequired,
	channelIsNotSafeForWork: PropTypes.bool
}