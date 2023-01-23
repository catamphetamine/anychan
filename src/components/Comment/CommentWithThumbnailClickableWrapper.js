import React, { useCallback } from 'react'
import PropTypes from 'prop-types'

import CommentClickableWrapper from './CommentClickableWrapper.js'

import useOnLongPressOrDoubleClick from './useOnLongPressOrDoubleClick.js'

import OnLongPress from 'frontend-lib/components/OnLongPress.js'

import {
	comment as commentType,
	threadId,
	channelId
} from '../../PropTypes.js'

export default function CommentWithThumbnailClickableWrapper({
	comment,
	threadId,
	channelId,
	onClick,
	onReply,
	children
}) {
	const onLongPressOrDoubleClick = useOnLongPressOrDoubleClick(onReply)

	if (onClick) {
		return (
			<CommentClickableWrapper
				onClick={onClick}
				commentId={comment.id}
				threadId={threadId}
				channelId={channelId}>
				{children}
			</CommentClickableWrapper>
		)
	}

	if (onLongPressOrDoubleClick) {
		return (
			<OnLongPress
				touch
				onLongPress={onLongPressOrDoubleClick}>
				{children}
			</OnLongPress>
		)
	}

	return children
}

CommentWithThumbnailClickableWrapper.propTypes = {
	comment: commentType.isRequired,
	threadId: threadId.isRequired,
	channelId: channelId.isRequired,
	onClick: PropTypes.func,
	onReply: PropTypes.func
}