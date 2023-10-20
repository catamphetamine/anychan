import React, { useState, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { Button, DropFileUpload, FileUploadButton } from 'react-responsive-ui'
import { isKeyCombination } from 'web-browser-input'
import classNames from 'classnames'

import { Form, Field, Submit, FormComponent } from './Form.js'

import LinearProgress from 'frontend-lib/components/LinearProgress.js'
import { FadeInOut } from 'react-responsive-ui'

import useEffectSkipMount from 'frontend-lib/hooks/useEffectSkipMount.js'

// import SendIcon from 'frontend-lib/icons/send-plane-fill.svg'
import SendIcon from 'frontend-lib/icons/big-arrow-up-outline.svg'
import CancelIcon from 'frontend-lib/icons/close-thicker.svg'
import AttachIcon from 'frontend-lib/icons/attach.svg'
import FileIcon from 'frontend-lib/icons/file-wide.svg'

import getFileInfo from 'frontend-lib/utility/file/getFileInfo.js'
import getFileDataUrl from 'frontend-lib/utility/file/getFileDataUrl.js'
import getAudioFileInfoFromId3Tags from 'frontend-lib/utility/file/getAudioFileInfoFromId3Tags.js'

import TextButton from './TextButton.js'
import LoadingSpinner from './LoadingSpinner.js'

import PostAttachments from 'social-components-react/components/PostAttachments.js'

import useSlideshow from './Comment/useSlideshow.js'

import { showError } from '../redux/notifications.js'

import useMessages from '../hooks/useMessages.js'

import './PostForm.css'

function PostForm({
	placement,
	autoFocus,
	initialState,
	onStateDidChange,
	initialInputValue,
	onInputValueChange,
	initialError,
	onErrorDidChange,
	initialInputHeight,
	onInputHeightDidChange,
	initialFiles,
	onFilesDidChange,
	initialAttachments,
	onAttachmentsDidChange,
	onHeightDidChange,
	onCancel,
	onSubmit: onSubmit_
}, ref) {
	const messages = useMessages()

	const [error, setError] = useState(initialError)
	const [loading, setLoading] = useState()

	const [files, setFiles] = useState(initialFiles || [])
	const [fileAttachments, setFileAttachments] = useState(initialAttachments || [])

	useEffectSkipMount(() => {
		if (onErrorDidChange) {
			onErrorDidChange(error)
		}
	}, [error])

	useEffectSkipMount(() => {
		// They say that two consequtive `setState()` calls are batched together.
		// Still, in case there's any weird behavior in some hypothetical future,
		// this `if` consistency check here guards against possible weird bugs
		// resulting from possibly inconsistent data being written in the form state.
		if (files.length === fileAttachments.length) {
			if (onFilesDidChange) {
				onFilesDidChange(files)
			}
			if (onAttachmentsDidChange) {
				onAttachmentsDidChange(fileAttachments)
			}
		}
	}, [files, fileAttachments])

	const onSubmit = useCallback(async (values) => {
		try {
			setLoading(true)
			await onSubmit_(values)
		} catch (error) {
			console.error(error)
			setError(error.message)
		} finally {
			setLoading(false)
		}
	})

	const onInputKeyDown = useCallback((event) => {
		if (isKeyCombination(event, ['Esc'])) {
			event.preventDefault()
			onCancel()
		}
	}, [])

	const dummyPostWithAttachments = useMemo(() => {
		return {
			attachments: fileAttachments
		}
	}, [fileAttachments])

	const { onAttachmentClick } = useSlideshow({ comment: dummyPostWithAttachments })

	const dispatch = useDispatch()

	const onFileAttached = useCallback(async (file) => {
		try {
			const attachment = await createAttachmentForFile(file)
			attachment.id = getNextAttachmentId(fileAttachments)
			setFiles(files.concat({ file, id: attachment.id }))
			setFileAttachments(fileAttachments.concat(attachment))
			if (onHeightDidChange) {
				onHeightDidChange()
			}
		} catch (error) {
			dispatch(showError(messages.errors.attachFileError))
			throw error
		}
	}, [
		files,
		fileAttachments,
		messages
	])

	const loadingIndicatorFadeOutDuration = 160 // ms

	const canAttachFiles = true

	// Doesn't use `autoFocus={true}` property here by default.
	// The reason that if `autoFocus={true}` property is set
	// then the form would focus itself when rendered.
	// On a thread page, there's a list of comments,
	// and each comment can have a "Reply" form open by the user.
	// For the list of comments, `virtual-scroller` component
	// is used to unmount the comments that're off screen.
	// Therefore, when the user scrolls back to the comment
	// for which they had a "Reply" form open, `virtual-scroller`
	// re-mounts that form and the cursor jumps inside its input,
	// causing the page scroll position to jump accordingly.

	const formElement = (
		<section className={classNames('PostForm', {
			'PostForm--page': placement === 'page',
			'PostForm--comment': placement === 'comment'
		})}>
			<Form
				ref={ref}
				autoFocus={autoFocus}
				onSubmit={onSubmit}
				initialState={initialState}
				onStateDidChange={onStateDidChange}
				className={classNames('form', 'PostForm-form')}>
				<FormComponent>
					<Field
						required
						name={POST_FORM_INPUT_FIELD_NAME}
						type="text"
						multiline
						rows={2}
						value={initialInputValue}
						onChange={onInputValueChange}
						initialHeight={initialInputHeight}
						onHeightChange={onInputHeightDidChange}
						onKeyDown={placement === 'comment' ? onInputKeyDown : undefined}
						placeholder={messages.post.form.inputText}
						className="PostForm-textInput"
					/>
				</FormComponent>
				{onCancel &&
					<Button
						onClick={onCancel}
						title={messages.actions.close}
						className="PostForm-close">
						<CancelIcon className="PostForm-closeIcon"/>
					</Button>
				}
				<Submit
					component={Button}
					title={messages.actions.post}
					className="PostForm-action">
					{/*messages.actions.post*/}
					<SendIcon className="PostForm-actionIcon"/>
				</Submit>
				<FadeInOut show={loading} fadeOutDuration={loadingIndicatorFadeOutDuration}>
					<LinearProgress className="PostForm-loading"/>
				</FadeInOut>
			</Form>
			{error &&
				<div className="PostForm-error">
					{error}
				</div>
			}
			{canAttachFiles && fileAttachments.length > 0 &&
				<PostAttachments
					compact
					post={dummyPostWithAttachments}
					useSmallestThumbnails={true}
					maxAttachmentThumbnails={false}
					attachmentThumbnailSize={undefined}
					spoilerLabel={messages.post.spoiler}
					onAttachmentClick={onAttachmentClick}
				/>
			}
			{canAttachFiles && fileAttachments.length > 0 &&
				<div className="PostForm-attachments">
					<ul className="PostForm-attachmentsList">
						{fileAttachments.map((attachment, i) => {
							const file = files.find(_ => _.id === attachment.id).file
							const fileExtension = getFileExtension(file.name)
							return (
								<li key={i} className="PostForm-attachment">
									<div className="PostForm-attachmentThumbnail">
										<FileIcon className="PostForm-attachmentIcon"/>
										<div className={classNames('PostForm-attachmentFileExtension', {
											'PostForm-attachmentFileExtension--longer': fileExtension.length >= 4 && fileExtension.length < 5,
											'PostForm-attachmentFileExtension--long': fileExtension.length >= 5
										})}>
											{fileExtension}
										</div>
									</div>
									<div className="PostForm-attachmentTitle">
										{file.name}
									</div>
									{/*<LoadingSpinner/>*/}
									{/*file.type*/}
								</li>
							)
						})}
					</ul>
				</div>
			}
			{canAttachFiles &&
				<FileUploadButton
					component={TextButton}
					type="button"
					onChange={onFileAttached}
					className="PostForm-attachFile">
					<AttachIcon className="PostForm-attachFileIcon"/>
					{messages.actions.attachFile}
				</FileUploadButton>
			}
		</section>
	)

	if (canAttachFiles) {
		return (
			<DropFileUpload
				clickable={false}
				onChange={onFileAttached}
				className="PostForm-dropFileArea"
				draggedOverClassName="PostForm-dropFileArea--draggedOver">
				{formElement}
			</DropFileUpload>
		)
	}

	return formElement
}

PostForm = React.forwardRef(PostForm)

PostForm.propTypes = {
	placement: PropTypes.oneOf(['page', 'comment']).isRequired,
	autoFocus: PropTypes.bool,
	onCancel: PropTypes.func,
	onSubmit: PropTypes.func.isRequired,
	initialState: PropTypes.object,
	onStateDidChange: PropTypes.func,
	initialError: PropTypes.string,
	onErrorDidChange: PropTypes.func,
	initialInputValue: PropTypes.string,
	onInputValueChange: PropTypes.func,
	initialInputHeight: PropTypes.number,
	onInputHeightDidChange: PropTypes.func,
	initialFiles: PropTypes.arrayOf(PropTypes.object),
	onFilesDidChange: PropTypes.func,
	initialAttachments: PropTypes.arrayOf(PropTypes.object),
	onAttachmentsDidChange: PropTypes.func,
	onHeightDidChange: PropTypes.func
}

export default PostForm

export const POST_FORM_INPUT_FIELD_NAME = 'content'

function getFileExtension(name) {
	const parts = name.split('.')
	if (parts.length > 1) {
		return parts[parts.length - 1]
	}
}

async function createAttachmentForFile(file) {
	const [type, subtype] = file.type.split('/')
	switch (type) {
		case 'image':
			const imageInfo = await getFileInfo(file)
			return {
				type: 'picture',
				picture: {
					type: imageInfo.type,
					size: imageInfo.size,
					width: imageInfo.width,
					height: imageInfo.height,
					url: imageInfo.url
				}
			}
		case 'video':
			const videoInfo = await getFileInfo(file)
			return {
				type: 'video',
				video: {
					type: videoInfo.type,
					size: videoInfo.size,
					width: videoInfo.width,
					height: videoInfo.height,
					url: videoInfo.url,
					duration: videoInfo.duration,
					picture: {
						type: videoInfo.picture.type,
						width: videoInfo.picture.width,
						height: videoInfo.picture.height,
						url: videoInfo.picture.url
					}
				}
			}
		case 'audio':
			const audioInfo = await getFileInfo(file)
			const audioId3Tags = await getAudioFileInfoFromId3Tags(file)
			// Get audio title.
			let title
			if (audioId3Tags.title) {
				title = audioId3Tags.title
				if (audioId3Tags.artist) {
					title = audioId3Tags.artist + ' — ' + audioId3Tags.title
				}
			}
			// Return audio attachment.
			return {
				type: 'audio',
				audio: {
					title,
					type: audioInfo.type,
					size: audioInfo.size,
					url: audioInfo.url,
					duration: audioInfo.duration
				}
			}
		default:
			const fileDataUrl = await getFileDataUrl(file)
			return {
				type: 'file',
				file: {
					name: file.name,
					type: file.type,
					size: file.size,
					url: fileDataUrl
				}
			}
	}
}

function getNextAttachmentId(attachments) {
	let id = 1
	for (const attachment of attachments) {
		if (attachment.id) {
			id = Math.max(id, attachment.id)
		}
	}
	return id + 1
}