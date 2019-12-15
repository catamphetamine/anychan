import React, { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'

import UserData from '../UserData/UserData'
import onUserDataChange from '../UserData/onUserDataChange'

export default function CommentReadStatusWatcher({
	mode,
	boardId,
	threadId,
	commentId
}) {
	const isActive = (mode === 'board' && !isThreadSeen(boardId, threadId)) ||
		(mode === 'thread' && !isCommentRead(boardId, threadId, commentId))
	const node = useRef()
	const dispatch = useDispatch()
	useEffect(() => {
		if (!isActive) {
			return
		}
		if (!CommentReadObserver) {
			// Uses `dispatch`.
			function onCommentRead(entries, observer) {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						// If some later comment has already been marked as read
						// then don't overwrite it.
						// Some later comment could have been marked as read,
						// for example, if a user somehow managed to scroll to bottom
						// without scrolling through previous comments.
						// Or maybe the user already read some later comment
						// in another tab.
						const element = entry.target
						const boardId = element.dataset.boardId
						const threadId = parseInt(element.dataset.threadId)
						const commentId = parseInt(element.dataset.commentId)
						const mode = element.dataset.mode
						if (mode === 'thread' && !isCommentRead(boardId, threadId, commentId)) {
							// Sets the latest read comment id.
							UserData.addLatestReadComments(boardId, threadId, commentId)
							// Update tracked threads list new comments counters in Sidebar.
							if (UserData.getTrackedThreads(boardId, threadId)) {
								onUserDataChange(UserData.prefix + 'latestReadComments', dispatch)
							}
						}
						if (mode === 'board' && !isThreadSeen(boardId, threadId)) {
							// Sets the latest seen thread id.
							UserData.addLatestSeenThreads(boardId, threadId)
						}
						CommentReadObserver.unobserve(element)
					}
				}
			}
			// Every modern browser except Internet Explorer supports `IntersectionObserver`s.
			// https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
			// https://caniuse.com/#search=IntersectionObserver
			CommentReadObserver = new IntersectionObserver(onCommentRead, {
				root: null,
				// top, right, bottom, left.
				// `1px` compensates the height of the "invisible line".
				rootMargin: '0px 0px 1px 0px',
				threshold: 0
			})
		}
		// Sometimes `node.current` is `undefined`
		// in the returned function for some reason.
		const element = node.current
		CommentReadObserver.observe(element)
		return () => {
			CommentReadObserver.unobserve(element)
		}
	}, [])
	if (!isActive) {
		return null
	}
	return (
		<div
			ref={node}
			style={INVISIBLE_LINE_STYLE}
			data-mode={mode}
			data-board-id={boardId}
			data-thread-id={threadId}
			data-comment-id={commentId}/>
	)
}

CommentReadStatusWatcher.propTypes = {
	mode: PropTypes.oneOf(['board', 'thread']).isRequired,
	boardId: PropTypes.string.isRequired,
	threadId: PropTypes.number.isRequired,
	commentId: PropTypes.number.isRequired
}

const INVISIBLE_LINE_STYLE = {
	height: '1px',
	// Used to be `marginBottom: -1px` but that returned
	// incorrect item spacing of `-1px` in `VirtualScroller`.
	marginTop: '-1px'
}

let CommentReadObserver

function isCommentRead(boardId, threadId, commentId) {
	const latestReadCommentId = UserData.getLatestReadComments(boardId, threadId)
	return latestReadCommentId && latestReadCommentId >= commentId
}

function isThreadSeen(boardId, threadId) {
	const latestSeenThreadId = UserData.getLatestSeenThreads(boardId)
	return latestSeenThreadId && latestSeenThreadId >= threadId
}