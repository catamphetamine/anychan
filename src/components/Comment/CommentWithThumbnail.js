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

import { clickableElementPropsType } from 'frontend-lib/components/OnLongPress.js'

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
	// `elementRef` property is supplied by `<CommentTree/>` and is used later
	// to scroll to the parent post when the user hides its tree of replies.
	elementRef,
	onPostUrlClick: onPostUrlClick_,
	onReply,
	// "Reply on double click":
	clickableElementProps,
	className,
	// <Comment/> props:
	...rest
}) {
	const { onAttachmentClick } = useSlideshow({ comment })

	const [attachmentsChangeTrigger, setAttachmentsChangeTrigger] = useState()

	const reRenderAttachments = useCallback(() => {
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
				reRenderAttachments={reRenderAttachments}
				commentClassName={commentClassName}
			/>
		)
	}

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
			{...clickableElementProps}
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
	elementRef: PropTypes.object,
	onPostUrlClick: PropTypes.func,
	onReply: PropTypes.func,
	clickableElementProps: clickableElementPropsType,
	className: PropTypes.string
}