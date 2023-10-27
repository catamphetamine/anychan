import React, { useState, useCallback, useMemo, useRef, useLayoutEffect } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { Button, DropFileUpload, FileUploadButton } from 'react-responsive-ui'
import { isKeyCombination } from 'web-browser-input'
import classNames from 'classnames'

import { Form, Field, Submit, FormComponent } from './Form.js'

import LinearProgress from 'frontend-lib/components/LinearProgress.js'
import { FadeInOut } from 'react-responsive-ui'

import useEffectSkipMount from 'frontend-lib/hooks/useEffectSkipMount.js'
import useLayoutEffectSkipMount from 'frontend-lib/hooks/useLayoutEffectSkipMount.js'
import useIsMounted from 'frontend-lib/hooks/useIsMounted.js'

// import SendIcon from 'frontend-lib/icons/send-plane-fill.svg'
import SendIcon from 'frontend-lib/icons/big-arrow-up-outline.svg'
import CancelIcon from 'frontend-lib/icons/close-thicker.svg'
import AttachIcon from 'frontend-lib/icons/attach.svg'
import FileIcon from 'frontend-lib/icons/file-wide.svg'

import getFileInfo from 'frontend-lib/utility/file/getFileInfo.js'
import getFileDataUrl from 'frontend-lib/utility/file/getFileDataUrl.js'
import getAudioFileInfoFromId3Tags from 'frontend-lib/utility/file/getAudioFileInfoFromId3Tags.js'

import TextButton from './TextButton.js'
// import LoadingSpinner from './LoadingSpinnerRadialBars.js'
import LoadingSpinner from './LoadingSpinnerCirclingComet.js'

import PostAttachments from 'social-components-react/components/PostAttachments.js'

import useSlideshow from './Comment/useSlideshow.js'

import shouldUseProxy from '../utility/proxy/shouldUseProxy.js'

import { showError } from '../redux/notifications.js'

import useMessages from '../hooks/useMessages.js'
import useDataSource from '../hooks/useDataSource.js'

import './PostForm.css'

function PostForm({
	expanded: expandedPropertyValue,
	onExpandedChange,
	unexpandOnClose,
	expandOnInteraction,
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
	attachmentThumbnailSize = 250,
	onCancel,
	onSubmit: onSubmit_,
	className
}, ref) {
	const isMounted = useIsMounted()

	const messages = useMessages()

	const form = useRef()
	const setForm = (formElement) => {
		form.current = formElement
		if (ref) {
			if (typeof ref === 'function') {
				ref(formElement)
			} else {
				ref.current = formElement
			}
		}
	}

	const [error, setError] = useState(initialError)
	const [loading, setLoading] = useState(false)

	const [files, setFiles] = useState(initialFiles || [])
	const [fileAttachments, setFileAttachments] = useState(initialAttachments || [])

	const [filesBeingProcessed, setFilesBeingProcessed] = useState([])

	const [hasInteracted, setHasInteracted] = useState(false)
	const [expanded, setExpanded] = useState(expandedPropertyValue)

	useEffectSkipMount(() => {
		if (onErrorDidChange) {
			onErrorDidChange(error)
		}
	}, [error])

	const applyExpandedValue = useCallback((value) => {
		setExpanded(value)
		if (onExpandedChange) {
			onExpandedChange(value)
		}
	}, [
		onExpandedChange
	])

	const unExpand = useCallback(() => {
		applyExpandedValue(false)
	}, [applyExpandedValue])

	const onClose = onCancel || (expanded && unexpandOnClose && unExpand)

	useEffectSkipMount(() => {
		applyExpandedValue(expandedPropertyValue)
	}, [
		expandedPropertyValue
	])

	useLayoutEffectSkipMount(() => {
		if (onHeightDidChange) {
			onHeightDidChange()
		}
	}, [expanded])

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
			await onSubmit_({
				content: values[POST_FORM_INPUT_FIELD_NAME],
				attachmentFiles: files.map(_ => _.file)
			})
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

	const onAttachmentRemove = useCallback((attachment) => {
		setFiles((files) => files.filter(_ => _.id !== attachment.id))
		setFileAttachments((fileAttachments) => fileAttachments.filter(_ => _ !== attachment))
	}, [])

	const dispatch = useDispatch()

	const onFileAttached = useCallback(async (file) => {
		// Get a temporary ID for the file being processed.
		const id = getNextFileBeingProcessedId()
		try {
			// Mark the file as "is being processed".
			setFilesBeingProcessed((filesBeingProcessed) => {
				return filesBeingProcessed.concat({ id })
			})
			// Process the file.
			const attachment = await createAttachmentForFile(file)
			// Exit if the `<PostForm/>` was closed or navigated from
			// while the attachment was being processed.
			if (!isMounted()) {
				return
			}
			// When getting next attachment ID, it doesn't look into `fileAttachments`
			// to see what's the next unused one because two files could be uploaded
			// simultaneously, and each such upload handler function would have
			// a stale copy of the `fileAttachments` state variable.
			attachment.id = getNextAttachmentId()
			// Unmark the file as "is being processed".
			setFilesBeingProcessed((filesBeingProcessed) => {
				return filesBeingProcessed.filter(_ => _.id !== id)
			})
			// Show the new attachment in the `<PostForm/>`.
			setFiles((files) => files.concat({ file, id: attachment.id }))
			setFileAttachments((fileAttachments) => fileAttachments.concat(attachment))
			// The `<PostForm/>`'s height did change.
			if (onHeightDidChange) {
				onHeightDidChange()
			}
		} catch (error) {
			// Unmark the file as "is being processed".
			setFilesBeingProcessed((filesBeingProcessed) => {
				return filesBeingProcessed.filter(_ => _.id !== id)
			})
			// Show an error message.
			dispatch(showError(messages.errors.attachFileError))
			throw error
		}
	}, [
		messages,
		isMounted
	])

	const onFileOrFilesAttached = useCallback(async (fileOrFiles) => {
		if (Array.isArray(fileOrFiles)) {
			for (const file of fileOrFiles) {
				onFileAttached(file)
			}
		} else {
			onFileAttached(fileOrFiles)
		}
	}, [onFileAttached])

	const onDrop = useCallback(async (something) => {
		// If a file is dropped, it's gonna be a `Blob` (`File`) or an array of `Blob`s (`File`s).
		// If a text selection is dropped, it's gonna be a `DataTransferItem`.
		if (Array.isArray(something) && something.every(_ => _ instanceof Blob)) {
			for (const file of something) {
				onFileAttached(file)
			}
		} else if (something instanceof Blob) {
			onFileAttached(something)
		} else if (something instanceof DataTransferItem) {
			something.getAsString((string) => {
				string = string.trim()
				if (form.current) {
					const getInputValue = () => form.current.get(POST_FORM_INPUT_FIELD_NAME)
					const setInputValue = (value) => form.current.set(POST_FORM_INPUT_FIELD_NAME, value)

					let inputValue = getInputValue()
					if (inputValue) {
						inputValue = inputValue.trim()
					}

					if (inputValue) {
						setInputValue(inputValue + '\n' + '\n' + string)
					} else {
						setInputValue(string)
					}

					form.current.focus()
				}
			})
		}
	}, [
		onFileAttached
	])

	const onInteraction = useCallback(() => {
		if (!hasInteracted) {
			setHasInteracted(true)
		}
		if (expandOnInteraction && !expanded) {
			applyExpandedValue(true)
		}
	}, [
		hasInteracted,
		expandOnInteraction,
		expanded,
		applyExpandedValue
	])

	const dataSource = useDataSource()

	const isPostingSupported = dataSource.supportsCreateComment() || dataSource.supportsCreateThread()
	const isPostingSupportedButNotWorking = dataSource.id === '2ch' || dataSource.id === '4chan'

	const doesUseProxy = useMemo(() => {
		return shouldUseProxy({ dataSource })
	}, [dataSource])

	const loadingIndicatorFadeOutDuration = 160 // ms

	const canAttachFiles = true

	// When passing an initial `value` property to a `<Field/>`,
	// it does set the input field's value, but it doesn't move the cursor
	// to the end of the input field. At least on Windows in Chrome in Oct 2023.
	// To work around that, manually call `input.setSelectionRange()` to reposition the caret.
	useLayoutEffect(() => {
		const input = form.current.getElement(POST_FORM_INPUT_FIELD_NAME)
		if (input && input.value) {
			input.setSelectionRange(input.value.length, input.value.length)
		}
	}, [])

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
		<section className={classNames(className, 'PostForm', {
			'PostForm--hasInteracted': hasInteracted,
			'PostForm--hasNotInteracted': !hasInteracted,
			'PostForm--notExpanded': !expanded,
			'PostForm--page': placement === 'page',
			'PostForm--comment': placement === 'comment'
		})}>
			<Form
				ref={setForm}
				autoFocus={autoFocus}
				onSubmit={onSubmit}
				initialState={initialState}
				onStateDidChange={onStateDidChange}
				className={classNames('form', 'PostForm-form')}>
				<FormComponent className="PostForm-textInputContainer">
					<Field
						name={POST_FORM_INPUT_FIELD_NAME}
						type="text"
						multiline
						rows={expanded ? 2 : 1}
						value={initialInputValue}
						onFocus={onInteraction}
						onClick={onInteraction}
						onChange={onInputValueChange}
						initialHeight={initialInputHeight}
						onHeightChange={onInputHeightDidChange}
						onKeyDown={placement === 'comment' ? onInputKeyDown : undefined}
						placeholder={messages.post.form.inputText}
					/>
				</FormComponent>
				{onClose &&
					<Button
						onClick={onClose}
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
				<p className="PostForm-error">
					{error}
				</p>
			}
			{isPostingSupported && isPostingSupportedButNotWorking &&
				<p className="PostForm-notWorkingNotice">
					{messages.doesNotWorkForTheDataSource}
				</p>
			}
			{isPostingSupported && doesUseProxy &&
				<p className="PostForm-proxyCaution">
					{messages.proxyPostingCaution}
				</p>
			}
			{canAttachFiles && fileAttachments.length > 0 &&
				<PostAttachments
					compact
					post={dummyPostWithAttachments}
					useSmallestThumbnails={true}
					maxAttachmentThumbnails={false}
					attachmentThumbnailSize={attachmentThumbnailSize}
					spoilerLabel={messages.post.spoiler}
					removeAttachmentLabel={messages.post.removeAttachment}
					onAttachmentClick={onAttachmentClick}
					onAttachmentRemove={onAttachmentRemove}
				/>
			}
			{/*canAttachFiles && fileAttachments.length > 0 &&
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
								</li>
							)
						})}
					</ul>
				</div>
			*/}
			{/*<LoadingSpinner/>*/}
			{/*file.type*/}
			{canAttachFiles &&
				<FileUploadButton
					multiple
					component={TextButton}
					type="button"
					onChange={onFileOrFilesAttached}
					className="PostForm-attachFile">
					{filesBeingProcessed.length === 0
						? <AttachIcon className="PostForm-attachFileIcon"/>
						: <LoadingSpinner className="PostForm-attachFileIcon PostForm-attachFileIcon--loading"/>
					}
					{messages.actions.attachFile}
				</FileUploadButton>
			}
		</section>
	)

	if (canAttachFiles) {
		return (
			<DropFileUpload
				multiple
				clickable={false}
				onChange={onDrop}
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
	expanded: PropTypes.bool,
	onExpandedChange: PropTypes.func,
	unexpandOnClose: PropTypes.bool,
	expandOnInteraction: PropTypes.bool,
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
	onHeightDidChange: PropTypes.func,
	attachmentThumbnailSize: PropTypes.number,
	className: PropTypes.string
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

// When getting next attachment ID, it doesn't look into `fileAttachments`
// to see what's the next unused one because two files could be uploaded
// simultaneously, and each such upload handler function would have
// a stale copy of the `fileAttachments` state variable.
// function getNextAttachmentId(attachments) {
// 	let id = 1
// 	for (const attachment of attachments) {
// 		if (attachment.id) {
// 			id = Math.max(id, attachment.id)
// 		}
// 	}
// 	return id + 1
// }

// "Safe" refers to the ability of JavaScript to represent integers exactly
// and to correctly compare them.
const MAX_SAFE_INTEGER = 9007199254740991

let attachmentId = 0
function getNextAttachmentId() {
	if (attachmentId === MAX_SAFE_INTEGER) {
		attachmentId = 0
	}
	attachmentId++
	return attachmentId
}

let processedFileId = 0
function getNextFileBeingProcessedId() {
	if (processedFileId === MAX_SAFE_INTEGER) {
		processedFileId = 0
	}
	processedFileId++
	return processedFileId
}

