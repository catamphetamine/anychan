import React, { useCallback, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-pages'
import classNames from 'classnames'

import PostForm from '../../components/PostFormWithAttachments.js'

import { channelId as channelIdType } from '../../PropTypes.js'

import TextButton from '../../components/TextButton.js'
import FillButton from '../../components/FillButton.js'

import useMessages from '../../hooks/useMessages.js'
import useSubmitCommentOrThread from '../../hooks/useSubmitCommentOrThread.js'
import useBackground from '../../hooks/useBackground.js'

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
	const navigate = useNavigate()
	const background = useBackground()

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
			navigate(`/${channelId}/${id}`)
		} else {
			dispatch(showError('Thread ID not found in server response'))
		}
	}, [
		navigate,
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

	const ButtonComponent = background ? FillButton : TextButton

	return (
		<div className="ChannelCreateThreadButton-container">
			{!showForm &&
				<ButtonComponent
					ref={createThreadButton}
					onClick={onShowForm}
					className={classNames('ChannelCreateThreadButton', {
						'ChannelCreateThreadButton--onBackground': background
					})}>
					{messages.createThread}
				</ButtonComponent>
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