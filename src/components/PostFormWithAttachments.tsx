import type { Attachment, EasyReactForm, Props } from '@/types'

import React, { useMemo, useState, useCallback, useEffect } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'

// @ts-expect-error
import { DropFileUpload, FileUploadButton } from 'react-responsive-ui'

// import FileIcon from 'frontend-lib/icons/file-wide.svg'
import AttachIcon from 'frontend-lib/icons/attach.svg'

import useIsMounted from 'frontend-lib/hooks/useIsMounted.js'
import useEffectSkipMount from 'frontend-lib/hooks/useEffectSkipMount.js'
// @ts-ignore
import useForwardedRef from 'frontend-lib/hooks/useForwardedRef.js'

import getFileInfo from 'frontend-lib/utility/file/getFileInfo.js'
import getFileDataUrl from 'frontend-lib/utility/file/getFileDataUrl.js'
import getAudioFileInfoFromId3Tags from 'frontend-lib/utility/file/getAudioFileInfoFromId3Tags.js'

import PostAttachments from 'social-components-react/components/PostAttachments.js'

import PostForm from './PostForm.js'
import TextButton from './TextButton.js'
// import LoadingSpinner from './LoadingSpinnerRadialBars.js'
import LoadingSpinner from './LoadingSpinnerCirclingComet.js'

import useSlideshow from './Comment/useSlideshow.js'

import { attachment as attachmentType } from '../PropTypes.js'

import useMessages from '../hooks/useMessages.js'

import convertPngToJpg from '../utility/convertPngToJpg.js'

import { showError } from '../redux/notifications.js'

import { POST_FORM_INPUT_FIELD_NAME } from './PostForm.js'
export { POST_FORM_INPUT_FIELD_NAME } from './PostForm.js'

import './PostFormWithAttachments.css'

const PostFormWithAttachments = React.forwardRef<EasyReactForm, PostFormWithAttachmentsProps>(({
	canAttachFiles,
	initialFiles,
	onFilesDidChange,
	initialAttachments,
	onAttachmentsDidChange,
	attachmentThumbnailSize = 250,
	onHeightDidChange,
	placement,
	className,
	...rest
}, ref) => {
	const { setRef: setForm, internalRef: form } = useForwardedRef(ref) // <EasyReactForm>

	const isMounted = useIsMounted()

	const dispatch = useDispatch()

	const [files, setFiles] = useState(initialFiles || [])
	const [fileAttachments, setFileAttachments] = useState(initialAttachments || [])

	const [filesBeingProcessed, setFilesBeingProcessed] = useState([])

	const messages = useMessages()

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

	const onFileAttached = useCallback(async (file: File | Blob) => {
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
			setFiles((files) => files.concat([{ file, id: attachment.id }]))
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

	// Handles pasting files into the form.
	useEffect(() => {
		const element = form.current.getElement()
		const onPaste = async (event: ClipboardEvent) => {
			const items = event.clipboardData.items
			// @ts-expect-error
			for (const item of items) {
				if (item.kind !== 'file') {
					continue
				}
				let file = item.getAsFile()
				if (file.type === 'image/png') {
					file = await convertPngToJpg(file)
				}
				onFileAttached(file)
			}
		}
		element.addEventListener('paste', onPaste)
		return () => {
			element.removeEventListener('paste', onPaste)
		}
	}, [
		onFileAttached
	])

	const dummyPostWithAttachments = useMemo(() => {
		return {
			attachments: fileAttachments
		}
	}, [fileAttachments])

	const { onAttachmentClick } = useSlideshow({ comment: dummyPostWithAttachments })

	const onAttachmentRemove = useCallback((attachment: Attachment) => {
		setFiles((files) => files.filter(_ => _.id !== attachment.id))
		setFileAttachments((fileAttachments) => fileAttachments.filter(_ => _ !== attachment))
	}, [])

	const onFileOrFilesAttached = useCallback(async (fileOrFiles: File | File[]) => {
		if (Array.isArray(fileOrFiles)) {
			for (const file of fileOrFiles) {
				onFileAttached(file)
			}
		} else {
			onFileAttached(fileOrFiles)
		}
	}, [onFileAttached])

	const onReset = useCallback(() => {
		setFiles([])
		setFileAttachments([])
	}, [])

	const attachmentFileValues = useMemo(() => {
		return files.map(_ => _.file)
	}, [files])

	const onDrop = useCallback(async (something: File[] | Blob | DataTransferItem) => {
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
					const setInputValue = (value?: string) => form.current.set(POST_FORM_INPUT_FIELD_NAME, value)

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

	return (
		<DropFileUpload
			multiple
			clickable={false}
			onChange={onDrop}
			className={classNames(className, 'PostFormWithAttachments', {
				'PostFormWithAttachments--comment': placement === 'comment'
			})}
			draggedOverClassName="PostFormWithAttachments--draggedOver">
			<PostForm
				ref={setForm}
				{...rest}
				placement={placement}
				onReset={onReset}
				attachmentFiles={attachmentFileValues}
				onHeightDidChange={onHeightDidChange}>
				{fileAttachments.length > 0 &&
					<PostAttachments
						compact
						post={dummyPostWithAttachments}
						useSmallestThumbnails={true}
						maxAttachmentThumbnails={Infinity}
						attachmentThumbnailSize={attachmentThumbnailSize}
						spoilerLabel={messages.post.spoiler}
						removeAttachmentLabel={messages.post.removeAttachment}
						onAttachmentClick={onAttachmentClick}
						onAttachmentRemove={onAttachmentRemove}
					/>
				}
				{/*fileAttachments.length > 0 &&
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
			</PostForm>
		</DropFileUpload>
	)
})

PostFormWithAttachments.propTypes = {
	canAttachFiles: PropTypes.bool,
	initialFiles: PropTypes.arrayOf(PropTypes.exact({
		id: PropTypes.number.isRequired,
		file: PropTypes.oneOfType([
			PropTypes.instanceOf(File),
			PropTypes.instanceOf(Blob)
		]).isRequired
	})),
	onFilesDidChange: PropTypes.func,
	initialAttachments: PropTypes.arrayOf(attachmentType),
	onAttachmentsDidChange: PropTypes.func,
	attachmentThumbnailSize: PropTypes.number,
	onHeightDidChange: PropTypes.func,
	placement: PropTypes.oneOf(['page', 'comment'] as const).isRequired,
	className: PropTypes.string
}

type PostFormWithAttachmentsProps = {
	canAttachFiles?: boolean;
	initialFiles?: { id: number, file: File | Blob }[];
	onFilesDidChange: (files: { id: number, file: File | Blob }[]) => void;
	initialAttachments?: Attachment[];
	onAttachmentsDidChange: (attachments: Attachment[]) => void;
	attachmentThumbnailSize?: number;
	onHeightDidChange?: () => void;
	placement: 'page' | 'comment';
	className?: string;
} & Omit<Props<typeof PostForm>,
	'placement' |
	'onReset' |
	'attachmentFiles' |
	'onHeightDidChange'
>

export default PostFormWithAttachments

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

async function createAttachmentForFile(file: File | Blob): Promise<Attachment> {
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
					name: file instanceof File ? file.name : undefined,
					type: file.type,
					size: file.size,
					url: fileDataUrl
				}
			}
	}
}

function getFileExtension(name: string) {
	const parts = name.split('.')
	if (parts.length > 1) {
		return parts[parts.length - 1]
	}
}