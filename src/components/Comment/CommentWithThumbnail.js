import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import PostAttachmentThumbnail from 'social-components-react/components/PostAttachmentThumbnail.js'
import PictureStack from 'social-components-react/components/PictureStack.js'

import {
	comment as commentType
} from '../../PropTypes.js'

import usePostThumbnail from './usePostThumbnail.js'

import getMessages from '../../messages/index.js'

// I don't know why are there constants defined in `window` object.
// Maybe they were meant to be some "default" constants that
// could be overwridden by a user via javascript or via the Console, or smth.
window.SHOW_POST_THUMBNAIL = true
window.SHOW_POST_STATS_ON_THE_LEFT_SIDE = false

function CommentWithThumbnail({
	mode,
	comment,
	hidden,
	locale,
	onReply,
	expandAttachments,
	onAttachmentClick,
	shouldFixAttachmentPictureSize,
	showPostThumbnailWhenThereAreMultipleAttachments,
	showPostThumbnailWhenThereIsNoContent,
	showOnlyFirstAttachmentThumbnail,
	className,
	children,
	...rest
}, ref) {
	const [
		postThumbnail,
		postThumbnailMoreAttachmentsCount,
		postThumbnailOnClick,
		postThumbnailSizeStyle
	] = usePostThumbnail({
		comment,
		showPostThumbnailWhenThereAreMultipleAttachments,
		showPostThumbnailWhenThereIsNoContent,
		showOnlyFirstAttachmentThumbnail,
		expandAttachments,
		hidden,
		onAttachmentClick
	})

	let postThumbnailElement

	if (postThumbnail) {
		postThumbnailElement = (
			<PostAttachmentThumbnail
				border
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

	// I don't know why does it read the value from `window`.
	// Maybe it was meant to be a "default" constant that
	// could be overwridden by a user via javascript or via the Console, or smth.
	const showThumbnail = window.SHOW_POST_THUMBNAIL;

	return (
		<article
			{...rest}
			ref={ref}
			data-comment-id={comment.id}
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
		</article>
	)
	// commentCreatedAt={comment.createdAt}
	// commentUpdatedAt={comment.updatedAt}
}

CommentWithThumbnail = React.forwardRef(CommentWithThumbnail)

CommentWithThumbnail.propTypes = {
	mode: PropTypes.oneOf(['channel', 'thread']).isRequired,
	comment: commentType.isRequired,
	hidden: PropTypes.bool,
	locale: PropTypes.string.isRequired,
	onReply: PropTypes.func,
	expandAttachments: PropTypes.bool,
	onAttachmentClick: PropTypes.func,
	shouldFixAttachmentPictureSize: PropTypes.bool,
	showPostThumbnailWhenThereAreMultipleAttachments: PropTypes.bool,
	showPostThumbnailWhenThereIsNoContent: PropTypes.bool,
	showOnlyFirstAttachmentThumbnail: PropTypes.bool,
	className: PropTypes.string,
	children: PropTypes.node.isRequired
}

export default CommentWithThumbnail