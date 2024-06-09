import { type Attachment, type ChannelId, type ThreadId, type EasyReactFormState, EasyReactForm, Channel } from '@/types'

import React, { useCallback, useRef } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { useNavigate, usePageStateSelector } from 'react-pages'
import classNames from 'classnames'

import PostForm from '../../components/PostFormWithAttachments.js'

import { channelId as channelIdType } from '../../PropTypes.js'

import TextButton from '../../components/TextButton.js'
import FillButton from '../../components/FillButton.js'

import useMessages from '../../hooks/useMessages.js'
import useCreateCommentOrThread from '../../hooks/useCreateCommentOrThread.js'
import useBackground from '../../hooks/useBackground.js'

import useEffectSkipMount from 'frontend-lib/hooks/useEffectSkipMount.js'

import { updateCreateThreadState, resetCreateThreadState } from '../../redux/channelPage.js'
import { showError } from '../../redux/notifications.js'

import './ChannelCreateThreadButton.css'

export default function ChannelCreateThreadButton({
	channel,
	channelId,
	channelContainsExplicitContent
}: {
	channel: Channel,
	channelId: ChannelId,
	channelContainsExplicitContent?: boolean
}) {
	const messages = useMessages()
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const background = useBackground()

	const form = useRef<EasyReactForm>()
	const createThreadButton = useRef<HTMLButtonElement>()

	const createThreadState = usePageStateSelector('channelPage', state => state.channelPage.createThreadState)

	const {
		showForm,
		form: formState,
		formError: initialFormError,
		formInputHeight: initialFormInputHeight,
		formFiles: initialFormFiles,
		formAttachments: initialFormAttachments
	} = createThreadState || {}

	const onFormStateChange = useCallback((newState: EasyReactFormState) => {
		dispatch(updateCreateThreadState({
			form: newState
		}))
	}, [])

	const onFormErrorDidChange = useCallback((error: string) => {
		dispatch(updateCreateThreadState({
			formError: error
		}))
	}, [])

	const onFormInputHeightDidChange = useCallback((height: number) => {
		dispatch(updateCreateThreadState({
			formInputHeight: height
		}))
	}, [])

	const onFormFilesDidChange = useCallback((files: Array<{ id: number, file: File | Blob }>) => {
		dispatch(updateCreateThreadState({
			formFiles: files
		}))
	}, [])

	const onFormAttachmentsDidChange = useCallback((attachments: Attachment[]) => {
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

	const onAfterSubmit = useCallback(({ threadId }: { threadId: ThreadId }) => {
		dispatch(resetCreateThreadState())
		if (threadId) {
			navigate(`/${channelId}/${threadId}`, {
				context: {
					subscribeToThread: true
				}
			})
		} else {
			// Isn't supposed to happen, but just in case.
			dispatch(showError('Thread ID not found in server response'))
		}
	}, [
		navigate,
		channelId
	])

	const onSubmitThread = useCreateCommentOrThread({
		channel,
		channelId,
		channelContainsExplicitContent,
		onAfterSubmit
	})

	const onSubmit = useCallback(async ({
		content,
		attachmentFiles
	}: {
		content?: string,
		attachmentFiles: (File | Blob)[]
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
					channelId={channelId}
					channelContainsExplicitContent={channelContainsExplicitContent}
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
	channelContainsExplicitContent: PropTypes.bool
}