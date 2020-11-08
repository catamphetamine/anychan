import React, { useState, useRef, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import {
	comment as commentType,
	thread as threadType,
	board as boardType
} from '../../PropTypes'

import Clickable from 'webapp-frontend/src/components/Clickable'
import OnLongPress from 'webapp-frontend/src/components/OnLongPress'

import Comment from './Comment'
import CommentReadStatusWatcher from './CommentReadStatusWatcher'
import PostForm from '../PostForm'

import { notify } from 'webapp-frontend/src/redux/notifications'

import openLinkInNewTab from 'webapp-frontend/src/utility/openLinkInNewTab'

import { getCommentUrl } from '../../chan'
import getMessages from '../../messages'
import getBasePath from '../../utility/getBasePath'

import './CommentWrapped.css'

// `Comment_` is a class because `virtual-scroller` requires
// its `component` to be a React.Component in order to assign a `ref`
// that could be used for calling `.renderItem(i)` manually.
// (which is done when YouTube/Twitter/etc links are loaded)
export default function CommentWrapped({
	id,
	comment,
	thread,
	board,
	mode,
	locale,
	parentComment,
	onClick: onClick_,
	onClickUrl,
	initialShowReplyForm,
	onToggleShowReplyForm,
	onContentDidChange,
	dispatch,
	postRef,
	onPostUrlClick,
	...rest
}) {
	const [showReplyForm, setShowReplyForm] = useState(initialShowReplyForm)
	const replyForm = useRef()
	const isMounted = useRef()

	useEffect(() => {
		if (isMounted.current) {
			// Update reply form expanded state in `virtual-scroller` state.
			if (onToggleShowReplyForm) {
				onToggleShowReplyForm(showReplyForm)
			}
			// Reply form has been toggled: update `virtual-scroller` item height.
			if (onContentDidChange) {
				onContentDidChange()
			}
			if (!showReplyForm) {
				console.log('.focus() the "Reply" button of `postRef.current` here.')
			}
		} else {
			isMounted.current = true
		}
	}, [showReplyForm])

	const onClick = useCallback((event) => {
		event.preventDefault()
		onClick_(comment, thread, board)
	}, [onClick_, comment])

	const onReply = useCallback((quoteText) => {
		let text = '>>' + comment.id
		if (comment.id === thread.id) {
			text += ' (OP)'
		}
		text += '\n'
		if (quoteText) {
			text += '>' + quoteText
			text += '\n'
		}
		console.log(text)
		dispatch(notify(getMessages(locale).notImplemented))
		openLinkInNewTab(getCommentUrl(board, thread, comment))
		// if (showReplyForm) {
		// 	replyForm.current.focus()
		// } else {
		// 	setShowReplyForm(true)
		// }
	}, [
		board,
		thread,
		comment,
		locale,
		dispatch
	])

	const onCancelReply = useCallback(() => {
		setShowReplyForm(false)
		// Reset the draft in `localStorage` here.
	}, [
		comment
	])

	const onSubmitReply = useCallback(({ content }) => {
		dispatch(notify(getMessages(locale).notImplemented))
		// Disable reply form.
		// Show a spinner.
		// Wait for the new comment to be fetched as part of thread auto-update.
		// Hide the reply form.
		// Focus the "Reply" button of `postRef.current` here.
	}, [
		comment,
		locale
	])

	const onLongPressOrDoubleClick = useCallback((event) => {
		if (isElementApplicableForReplyOnLongPressOrDoubleClick(event.target)) {
			onReply()
		}
	}, [
		onReply
	])

	// `thread.expired: true` flag is set on thread page by `<AutoUpdate/>`
	// when a thread expired during auto-update.
	const canReply = mode === 'thread' && !thread.isLocked && !thread.expired

	// `4chan.org` displays attachment thumbnails as `125px`
	// (half the size) when they're not "OP posts".
	// `postRef` is supplied by `<CommentTree/>`
	// and is used to focus stuff on toggle reply form.
	let commentElement = (
		<Comment
			{...rest}
			postRef={postRef}
			mode={mode}
			comment={comment}
			thread={thread}
			board={board}
			locale={locale}
			urlBasePath={getBasePath()}
			onReply={canReply ? onReply : undefined}
			onDoubleClick={canReply ? onLongPressOrDoubleClick : undefined}
			dispatch={dispatch}
			parentComment={parentComment}/>
	)

	// `id` HTML attribute is intentionally "#comment-{commentId}"
	// and not "#{commentId}" as in "post-link"s, because otherwise
	// when navigating "post-link"s a web browser would scroll down
	// to the comment, and besides that the floating header would
	// obstruct the top of the comment.
	id = id === undefined ? (parentComment ? undefined : 'comment-' + comment.id) : id

	// Not using a `<Link/>` here because "<a> cannot appear as a descendant of <a>".
	// if (!onClick_ && onClickUrl) {
	// 	return (
	// 		<Link
	// 			id={id}
	// 			to={onClickUrl}
	// 			onClickClassName="Comment-container--click"
	// 			className="Comment-container">
	// 			{commentElement}
	// 		</Link>
	// 	)
	// }

	if (onClick_) {
		commentElement = (
			<Clickable
				filter={commentOnClickFilter}
				onClick={onClick}
				url={getBasePath() + onClickUrl}>
				{commentElement}
			</Clickable>
		)
	} else if (canReply) {
		commentElement = (
			<OnLongPress
				onLongPress={onLongPressOrDoubleClick}>
				{commentElement}
			</OnLongPress>
		)
	}

	const replyFormElement = showReplyForm ? (
		<PostForm
			ref={replyForm}
			locale={locale}
			onCancel={onCancelReply}
			onSubmit={onSubmitReply}/>
	) : null

	return (
		<div
			id={id}
			className="Comment-container">
			<div className="Comment-spacer"/>
			{commentElement}
			<CommentReadStatusWatcher
				mode={mode}
				boardId={board.id}
				threadId={thread.id}
				commentId={comment.id}
				commentIndex={thread.comments.indexOf(comment)}
				threadUpdatedAt={thread.updatedAt}/>
			{replyFormElement}
		</div>
	)
}

CommentWrapped.propTypes = {
	id: PropTypes.string,
	mode: PropTypes.oneOf(['board', 'thread']).isRequired,
	onClick: PropTypes.func,
	onClickUrl: PropTypes.string,
	comment: commentType.isRequired,
	thread: threadType.isRequired,
	board: boardType.isRequired,
	locale: PropTypes.string.isRequired,
	dispatch: PropTypes.func.isRequired,
	parentComment: commentType,
	initialShowReplyForm: PropTypes.bool,
	onToggleShowReplyForm: PropTypes.func,
	onContentDidChange: PropTypes.func
}

function commentOnClickFilter(element) {
	if (element.classList.contains('PostInlineSpoiler-contents')) {
		if (element.parentNode.dataset.hide) {
			return false
		}
	}
	return true
}

/*
function EllipsisVerticalIcon(props) {
	const radius = 8;
	return (
		<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${radius * 2} 100`}>
			<circle fill="currentColor" cx={radius} cy={radius} r={radius}/>
			<circle fill="currentColor" cx={radius} cy="50" r={radius}/>
			<circle fill="currentColor" cx={radius} cy={100 - radius} r={radius}/>
		</svg>
	)
}
*/

const ELEMENTS_APPLICABLE_FOR_REPLY_ON_LONG_PRESS_OR_DOUBLE_CLICK = [
	'Comment',
	'Comment-thumbnail',
	'Comment-thumbnailPlaceholder',
	'CommentAuthor',
	'PostTitle',
	'PostParagraph',
	'PostVideo',
	'PostPicture',
	'PostEmbeddedAttachmentTitle',
	'PostContent',
	'CommentFooter',
	'CommentFooter-left',
	'CommentFooter-right'
]

function isElementApplicableForReplyOnLongPressOrDoubleClick(element) {
	for (const className of ELEMENTS_APPLICABLE_FOR_REPLY_ON_LONG_PRESS_OR_DOUBLE_CLICK) {
		if (element.classList.contains(className)) {
			return true
		}
	}
}