import React, { useEffect, useRef, useMemo } from 'react'
import PropTypes from 'prop-types'

import {
	commentId,
	threadId,
	channelId
} from '../../PropTypes'

import UnreadCommentWatcher, {
	isCommentRead,
	isThreadSeen
} from '../../utility/UnreadCommentWatcher'

/**
 * A comment is assumed "read" when its bottom edge is visible
 * on the screen. It's not a "comment is fully visible" rule,
 * because if a comment is higher than the screen's height,
 * then it's never "fully visible".
 */
export default function CommentReadStatusWatcher({
	mode,
	channelId,
	threadId,
	commentId,
	commentIndex,
	// commentCreatedAt,
	// commentUpdatedAt,
	// threadUpdatedAt,
	unreadCommentWatcher
}) {
	// `isActive` is only used during the initial rendering.
	const isActive =
		(mode === 'channel' && !isThreadSeen(channelId, threadId)) ||
		(mode === 'thread' && !isCommentRead(channelId, threadId, commentId))
	const node = useRef()
	useEffect(() => {
		if (isActive) {
			return unreadCommentWatcher.watch(node.current)
		}
	}, [])
	if (!isActive) {
		return null
	}
	// data-comment-created-at={commentCreatedAt.getTime()}
	// data-comment-updated-at={commentUpdatedAt.getTime()}
	// data-thread-updated-at={threadUpdatedAt && threadUpdatedAt.getTime()}
	return (
		<div
			ref={node}
			data-mode={mode}
			data-channel-id={channelId}
			data-thread-id={threadId}
			data-comment-id={commentId}
			data-comment-index={commentIndex}/>
	)
}

CommentReadStatusWatcher.propTypes = {
	mode: PropTypes.oneOf(['channel', 'thread']).isRequired,
	channelId: channelId.isRequired,
	threadId: threadId.isRequired,
	commentId: commentId.isRequired,
	commentIndex: PropTypes.number.isRequired,
	// commentCreatedAt: PropTypes.instanceof(Date).isRequired,
	// commentUpdatedAt: PropTypes.instanceof(Date),
	// threadUpdatedAt: PropTypes.instanceof(Date),
	unreadCommentWatcher: PropTypes.instanceOf(UnreadCommentWatcher).isRequired
}

// // `<CommentReadStatusWatcher/>` is implemented as an empty element
// // of `0px` height. `IntersectionObserver` works with this approach,
// // but a bit differently in different browsers: in Chrome, it would
// // behave as if the empty element was `1px` in height, and passing
// // `rootMargin: "0px 0px 1px 0px"` would remove that inconsistency
// // by contracting the element's "hit box" by `1px` on the bottom.
// // (margin values order: top, right, bottom, left).
// // At the same time, in Firefox it works correctly, without any
// // `rootMargin`.
// export const ROOT_AREA_EXPANSION = '0px 0px 0px 0px'