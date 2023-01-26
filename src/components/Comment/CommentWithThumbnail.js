import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import WrapCommentWithThumbnail from './WrapCommentWithThumbnail.js'
import CommentHidden from './CommentHidden.js'
import Comment from './Comment.js'
import { hasAuthor } from './CommentAuthor.js'
import CommentWithThumbnailClickableWrapper from './CommentWithThumbnailClickableWrapper.js'

import useSlideshow from './useSlideshow.js'
import useCompact from './useCompact.js'
import usePreviouslyRead from './usePreviouslyRead.js'
import usePostUrlClick from './usePostUrlClick.js'
import useId from './useId.js'

import {
	comment as commentType,
	threadId,
	channelId
} from '../../PropTypes.js'

import getMessages from '../../messages/index.js'

window.SHOW_POST_HEADER = false
// window.POST_FULL_WIDTH = true

export default function CommentWithThumbnail({
	mode,
	comment,
	threadId,
	channelId,
	hidden,
	onRenderedContentDidChange,
	locale,
	expandAttachments,
	isPreviouslyRead,
	showingReplies,
	parentComment,
	compact,
	onPostUrlClick: onPostUrlClick_,
	className,

	onReply,

	// <WrapCommentWithThumbnail/> props:

	// `elementRef` is supplied by `<CommentTree/>`
	// and is used to to scroll to the parent post
	// when the user hides its tree of replies.
	elementRef,

	// These properties are passed by <OnLongPress/>:
	onTouchStart,
	onTouchEnd,
	onTouchMove,
	onTouchCancel,
	onDragStart,
	onMouseDown,
	onMouseUp,
	onMouseMove,
	onMouseLeave,

	// "Reply on double click":
	onDoubleClick,

	// <Comment/> props:
	...rest
}) {
	const { onAttachmentClick } = useSlideshow({ comment })

	const [attachmentsChangeTrigger, setAttachmentsChangeTrigger] = useState()

	const onAttachmentsDidChange = useCallback(() => {
		setAttachmentsChangeTrigger({})
	}, [])

	// Set default `compact` property.
	compact = useCompact({
		compact,
		mode,
		comment,
		threadId
	})

	// Create post URL "on click" handler.
	const {
		clickedPostUrl,
		onPostUrlClick
	} = usePostUrlClick({
		onPostUrlClick: onPostUrlClick_,
		comment
	})

	// Get `previouslyRead` flag value.
	const previouslyRead = usePreviouslyRead({
		isPreviouslyRead,
		showingReplies,
		parentComment,
		clickedPostUrl,
		comment
	})

	const commentClassName = 'Comment-comment'

	let commentElement
	if (hidden) {
		commentElement = (
			<CommentHidden
				mode={mode}
				comment={comment}
				messages={getMessages(locale)}
				className={commentClassName}
			/>
		)
	} else {
		commentElement = (
			<Comment
				{...rest}
				mode={mode}
				comment={comment}
				threadId={threadId}
				channelId={channelId}
				locale={locale}
				onReply={onReply}
				onRenderedContentDidChange={onRenderedContentDidChange}
				expandAttachments={expandAttachments}
				onAttachmentClick={onAttachmentClick}
				showingReplies={showingReplies}
				parentComment={parentComment}
				onPostUrlClick={onPostUrlClick}
				onAttachmentsDidChange={onAttachmentsDidChange}
				commentClassName={commentClassName}
			/>
		)
	}

	const onLongPressProps = {
		onTouchStart,
		onTouchEnd,
		onTouchMove,
		onTouchCancel,
		onDragStart,
		onMouseDown,
		onMouseUp,
		onMouseMove,
		onMouseLeave
	}

	// onTouchStart={onTouchStart}
	// onTouchEnd={onTouchEnd}
	// onTouchMove={onTouchMove}
	// onTouchCancel={onTouchCancel}
	// onDragStart={onDragStart}
	// onMouseDown={onMouseDown}
	// onMouseUp={onMouseUp}
	// onMouseMove={onMouseMove}
	// onMouseLeave={onMouseLeave}

	const id = useId({
		comment,
		parentComment
	})

	// `elementRef` is supplied by `<CommentTree/>`
	// and is used to to scroll to the parent post
	// when the user hides its tree of replies.
	return (
		<WrapCommentWithThumbnail
			ref={elementRef}
			as="article"
			id={id}
			{...onLongPressProps}
			onDoubleClick={onDoubleClick}
			mode={mode}
			comment={comment}
			threadId={threadId}
			locale={locale}
			expandAttachments={expandAttachments}
			onAttachmentClick={onAttachmentClick}
			showThumbnail={!hidden}
			className={classNames(className, 'Comment', `Comment--${mode}`, {
				'Comment--compact': compact,
				// 'Comment--removed': comment.removed,
				'Comment--titled': comment.title,
				'Comment--authored': hasAuthor(comment),
				'Comment--opening': mode === 'thread' && comment.id === threadId,
				'Comment--showHeader': window.SHOW_POST_HEADER,
				'Comment--fullWidth': window.POST_FULL_WIDTH,
				'Comment--previouslyRead': previouslyRead
			})}>
			{commentElement}
		</WrapCommentWithThumbnail>
	)
}

CommentWithThumbnail.propTypes = {
	mode: PropTypes.oneOf(['channel', 'thread']).isRequired,
	comment: commentType.isRequired,
	threadId: threadId.isRequired,
	channelId: channelId.isRequired,
	hidden: PropTypes.bool,
	onRenderedContentDidChange: PropTypes.func,
	locale: PropTypes.string.isRequired,
	expandAttachments: PropTypes.bool,
	isPreviouslyRead: PropTypes.func,
	showingReplies: PropTypes.bool,
	parentComment: commentType,
	compact: PropTypes.bool,
	onPostUrlClick: PropTypes.func,
	className: PropTypes.string,

	onReply: PropTypes.func,

	// `elementRef` is supplied by `<CommentTree/>`
	// and is used to to scroll to the parent post
	// when the user hides its replies tree.
	elementRef: PropTypes.any,
	onTouchStart: PropTypes.func,
	onTouchEnd: PropTypes.func,
	onTouchMove: PropTypes.func,
	onTouchCancel: PropTypes.func,
	onDragStart: PropTypes.func,
	onMouseDown: PropTypes.func,
	onMouseUp: PropTypes.func,
	onMouseMove: PropTypes.func,
	onMouseLeave: PropTypes.func,
	onDoubleClick: PropTypes.func
}