import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import PostAttachmentThumbnail from 'webapp-frontend/src/components/PostAttachmentThumbnail'
import PictureStack from 'webapp-frontend/src/components/PictureStack'

import {
	comment as commentType
} from '../../PropTypes'

import usePostThumbnail from './usePostThumbnail'

import getMessages from '../../messages'

window.SHOW_POST_THUMBNAIL = true
window.SHOW_POST_STATS_ON_THE_LEFT_SIDE = false

export default function CommentWithThumbnail({
	mode,
	comment,
	hidden,
	locale,
	onReply,
	expandAttachments,
	onAttachmentClick,
	shouldFixAttachmentPictureSize,
	showPostThumbnailWhenThereAreMultipleAttachments,
	className,
	children
}) {
	const [
		postThumbnail,
		postThumbnailMoreAttachmentsCount,
		postThumbnailOnClick,
		postThumbnailSizeStyle
	] = usePostThumbnail({
		comment,
		mode,
		showPostThumbnailWhenThereAreMultipleAttachments,
		expandAttachments,
		hidden,
		onAttachmentClick
	})
	let postThumbnailElement
	if (postThumbnail) {
		postThumbnailElement = (
			<PostAttachmentThumbnail
				useSmallestThumbnail
				attachment={postThumbnail}
				spoilerLabel={getMessages(locale).post && getMessages(locale).post.spoiler}
				onClick={postThumbnailOnClick}
				fixAttachmentPictureSize={shouldFixAttachmentPictureSize}/>
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
	const showThumbnail = window.SHOW_POST_THUMBNAIL;
	return (
		<div
			style={postThumbnailSizeStyle}
			className={classNames(className, {
				'Comment--showThumbnail': showThumbnail,
				'Comment--hasThumbnail': showThumbnail && postThumbnail,
				'Comment--hasNoThumbnail': showThumbnail && !postThumbnail,
			})}>
			{showThumbnail && postThumbnailElement &&
				<div className="Comment-thumbnail">
					{postThumbnailElement}
				</div>
			}
			{showThumbnail && !postThumbnailElement &&
				<div className="Comment-thumbnailPlaceholder"/>
			}
			{children}
		</div>
	)
	// commentCreatedAt={comment.createdAt}
	// commentUpdatedAt={comment.updatedAt}
}

CommentWithThumbnail.propTypes = {
	mode: PropTypes.oneOf(['board', 'thread']).isRequired,
	comment: commentType.isRequired,
	hidden: PropTypes.bool,
	locale: PropTypes.string.isRequired,
	onReply: PropTypes.func,
	expandAttachments: PropTypes.bool,
	onAttachmentClick: PropTypes.func.isRequired,
	shouldFixAttachmentPictureSize: PropTypes.bool,
	showPostThumbnailWhenThereAreMultipleAttachments: PropTypes.bool,
	className: PropTypes.string,
	children: PropTypes.node.isRequired
}