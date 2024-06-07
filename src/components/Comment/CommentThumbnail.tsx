import type { Mode, Comment, ThreadId, onAttachmentClick, Messages } from '@/types'

import React from 'react'
import PropTypes from 'prop-types'

import PostAttachmentThumbnail from 'social-components-react/components/PostAttachmentThumbnail.js'
import PictureStack from 'social-components-react/components/PictureStack.js'

import usePostThumbnail from './usePostThumbnail.js'
import useAttachmentThumbnailFlags from './useAttachmentThumbnailFlags.js'

import {
	comment as commentType,
	threadId
} from '../../PropTypes.js'

import './CommentThumbnail.css'

export default function CommentThumbnail({
	mode,
	comment,
	threadId,
	maxWidth,
	maxHeight,
	width,
	height,
	fit,
	expandAttachments,
	onAttachmentClick,
	messages,
	children
}: {
	mode: Mode,
	comment: Comment,
	threadId: ThreadId,
	maxWidth?: number,
	maxHeight?: number,
	width?: number,
	height?: number,
	fit?: 'cover' | 'scale-down',
	expandAttachments?: boolean,
	onAttachmentClick?: onAttachmentClick,
	messages: Messages,
	children?: (thumbnailElement: JSX.Element, { thumbnailSizeVarStyle }: { thumbnailSizeVarStyle: Record<string, string> }) => JSX.Element
}) {
	// Get attachment thumbnail flags.
	const {
		showOnlyFirstAttachmentThumbnail,
		shouldFixAttachmentPictureSize,
		showPostThumbnailWhenThereAreMultipleAttachments,
		showPostThumbnailWhenThereIsNoContent
	} = useAttachmentThumbnailFlags({
		mode,
		comment,
		threadId
	})

	const {
		postThumbnail,
		postThumbnailMoreAttachmentsCount,
		postThumbnailOnClick,
		postThumbnailSizeVarStyle
	} = usePostThumbnail({
		comment,
		showPostThumbnailWhenThereAreMultipleAttachments,
		showPostThumbnailWhenThereIsNoContent,
		showOnlyFirstAttachmentThumbnail,
		expandAttachments,
		onAttachmentClick
	})

	let postThumbnailElement = null

	if (postThumbnail) {
		postThumbnailElement = (
			<PostAttachmentThumbnail
				border
				useSmallestThumbnail
				fit={fit}
				width={width}
				height={height}
				maxWidth={maxWidth}
				maxHeight={maxHeight}
				attachment={postThumbnail}
				spoilerLabel={messages.post && messages.post.spoiler}
				onClick={postThumbnailOnClick}
				fixAttachmentPictureSize={shouldFixAttachmentPictureSize}
			/>
		)

		if (postThumbnailMoreAttachmentsCount) {
			// A container `<div/>` is used to prevent `<PictureStack/>` from stretching to the full height
			// of the comment because `.Comment-thumbnail` is `display: flex`.
			postThumbnailElement = (
				<PictureStack count={postThumbnailMoreAttachmentsCount + 1} className="CommentThumbnail-pictureStack">
					{postThumbnailElement}
				</PictureStack>
			)
		}
	}

	if (children) {
		return children(postThumbnailElement, {
			thumbnailSizeVarStyle: postThumbnailSizeVarStyle
		})
	}

	return postThumbnailElement
}

CommentThumbnail.propTypes = {
	mode: PropTypes.oneOf(['channel', 'thread']).isRequired,
	comment: commentType.isRequired,
	threadId: threadId.isRequired,
	maxWidth: PropTypes.number,
	maxHeight: PropTypes.number,
	width: PropTypes.number,
	height: PropTypes.number,
	fit: PropTypes.string,
	messages: PropTypes.object.isRequired,
	expandAttachments: PropTypes.bool,
	onAttachmentClick: PropTypes.func,
	children: PropTypes.func
}