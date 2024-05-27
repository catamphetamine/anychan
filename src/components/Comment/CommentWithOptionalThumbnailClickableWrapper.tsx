import type { Comment, ChannelId, ThreadId } from '@/types'

import React, { ReactElement, ReactNode, useCallback } from 'react'
import PropTypes from 'prop-types'

import CommentClickableWrapper from './CommentClickableWrapper.js'

import useOnLongPressOrDoubleClick from './useOnLongPressOrDoubleClick.js'

import OnLongPress from 'frontend-lib/components/OnLongPress.js'
import Clickable from 'frontend-lib/components/Clickable.js'

import {
	comment as commentType,
	threadId,
	channelId
} from '../../PropTypes.js'

export default function CommentWithOptionalThumbnailClickableWrapper({
	comment,
	threadId,
	channelId,
	onClick,
	onReply,
	children
}: CommentWithOptionalThumbnailClickableWrapperProps) {
	const onLongPressOrDoubleClick = useOnLongPressOrDoubleClick(onReply)

	if (onClick) {
		return (
			<CommentClickableWrapper
				onClick={onClick}
				commentId={comment.id}
				threadId={threadId}
				channelId={channelId}>
				{children({})}
			</CommentClickableWrapper>
		)
	}

	const onLongPressEnabled = false
	if (!onLongPressEnabled) {
		// Standard React's `onDoubleClick` event handler doesn't work for touch events.
		// `<Clickable onDoubleClick/>` does.
		return (
			<Clickable onDoubleClick={onLongPressOrDoubleClick}>
				{children({})}
			</Clickable>
		)
	}

	if (onLongPressOrDoubleClick) {
		return (
			<OnLongPress
				touchOnly
				onLongPress={onLongPressOrDoubleClick}>
				{(props: object) => {
					// Standard React's `onDoubleClick` event handler doesn't work for touch events.
					// `<Clickable onDoubleClick/>` does.
					return (
						<Clickable onDoubleClick={onLongPressOrDoubleClick}>
							{children(props)}
						</Clickable>
					)
				}}
			</OnLongPress>
		)
	}

	return children({})
}

CommentWithOptionalThumbnailClickableWrapper.propTypes = {
	comment: commentType.isRequired,
	threadId: threadId.isRequired,
	channelId: channelId.isRequired,
	onClick: PropTypes.func,
	onReply: PropTypes.func,
	children: PropTypes.func.isRequired
}

interface CommentWithOptionalThumbnailClickableWrapperProps {
	comment: Comment,
	threadId: ThreadId,
	channelId: ChannelId,
	onClick?: (commentId: number, threadId: number, channelId: string) => void,
	onReply?: () => void,
	children: (params: {}) => ReactElement
}