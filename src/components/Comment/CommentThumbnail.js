import React from 'react'
import PropTypes from 'prop-types'

import PostAttachmentThumbnail from 'social-components-react/components/PostAttachmentThumbnail.js'
import PictureStack from 'social-components-react/components/PictureStack.js'

import usePostThumbnail from './usePostThumbnail.js'
import useAttachmentThumbnailFlags from './useAttachmentThumbnailFlags.js'

import getMessages from '../../messages/index.js'

import {
	comment as commentType,
	threadId
} from '../../PropTypes.js'

export default function CommentThumbnail({
	mode,
	comment,
	threadId,
	maxWidth,
	maxHeight,
	expandAttachments,
	onAttachmentClick,
	locale,
	children
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
				maxWidth={maxWidth}
				maxHeight={maxHeight}
				attachment={postThumbnail}
				spoilerLabel={getMessages(locale).post && getMessages(locale).post.spoiler}
				onClick={postThumbnailOnClick}
				fixAttachmentPictureSize={shouldFixAttachmentPictureSize}
			/>
		)

		if (postThumbnailMoreAttachmentsCount) {
			// A container `<div/>` is used so that the `<PictureStack/>`
			// isn't stretched to the full height of the comment,
			// because `.Comment-thumbnail` is `display: flex`.
			postThumbnailElement = (
				<div>
					<PictureStack count={postThumbnailMoreAttachmentsCount + 1}>
						{postThumbnailElement}
					</PictureStack>
				</div>
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
	locale: PropTypes.string.isRequired,
	expandAttachments: PropTypes.bool,
	onAttachmentClick: PropTypes.func,
	children: PropTypes.func
}