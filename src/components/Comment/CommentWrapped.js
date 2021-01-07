import React, { useState, useRef, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import {
	comment as commentType,
	threadId,
	channelId
} from '../../PropTypes'

import Clickable from 'webapp-frontend/src/components/Clickable'
import OnLongPress from 'webapp-frontend/src/components/OnLongPress'

import Comment from './Comment'
import CommentReadStatusWatcher from './CommentReadStatusWatcher'
import NewAutoUpdateCommentsStartLine from './NewAutoUpdateCommentsStartLine'
import PostForm from '../PostForm'

import useMount from 'webapp-frontend/src/hooks/useMount'
import { notify } from 'webapp-frontend/src/redux/notifications'
import openLinkInNewTab from 'webapp-frontend/src/utility/openLinkInNewTab'

import { getCommentUrl, getThreadUrl } from '../../provider'
import getMessages from '../../messages'
import getBasePath from '../../utility/getBasePath'
import UnreadCommentWatcher from '../../utility/UnreadCommentWatcher'

import './CommentWrapped.css'

// `Comment_` is a class because `virtual-scroller` requires
// its `component` to be a React.Component in order to assign a `ref`
// that could be used for calling `.renderItem(i)` manually.
// (which is done when YouTube/Twitter/etc links are loaded)
export default function CommentWrapped({
	id,
	comment,
	threadId,
	channelId,
	channelIsNotSafeForWork,
	mode,
	locale,
	parentComment,
	showReplyAction,
	threadIsLocked,
	threadExpired,
	onClick: onClick_,
	onClickUrl,
	initialShowReplyForm,
	onToggleShowReplyForm,
	onRenderedContentDidChange,
	dispatch,
	elementRef,
	onPostUrlClick,
	unreadCommentWatcher,
	...rest
}) {
	const [showReplyForm, setShowReplyForm] = useState(initialShowReplyForm)
	const replyForm = useRef()
	const [isMounted, onMount] = useMount()

	useEffect(() => {
		if (isMounted()) {
			// Update reply form expanded state in `virtual-scroller` state.
			if (onToggleShowReplyForm) {
				onToggleShowReplyForm(showReplyForm)
			}
			// Reply form has been toggled: update `virtual-scroller` item height.
			if (onRenderedContentDidChange) {
				onRenderedContentDidChange()
			}
			if (!showReplyForm) {
				console.log('.focus() the "Reply" button of `elementRef.current` here.')
			}
		}
	}, [showReplyForm])

	const onClick = useCallback((event) => {
		event.preventDefault()
		onClick_(comment, threadId, channelId)
	}, [
		onClick_,
		comment,
		threadId,
		channelId
	])

	const onReply = useCallback((quoteText) => {
		if (threadIsLocked) {
			return dispatch(notify(getMessages(locale).threadIsLocked))
		}
		if (threadExpired) {
			return dispatch(notify(getMessages(locale).threadExpired))
		}
		const text = getReplyText({
			commentId: comment.id,
			threadId,
			quoteText
		})
		console.log(text)
		dispatch(notify(getMessages(locale).notImplemented))
		let url
		if (comment.id === threadId) {
			url = getThreadUrl(channelId, threadId, {
				isNotSafeForWork: channelIsNotSafeForWork
			})
		} else {
			url = getCommentUrl(channelId, threadId, comment.id, {
				isNotSafeForWork: channelIsNotSafeForWork
			})
		}
		openLinkInNewTab(url)
		// if (showReplyForm) {
		// 	replyForm.current.focus()
		// } else {
		// 	setShowReplyForm(true)
		// }
	}, [
		channelId,
		channelIsNotSafeForWork,
		threadId,
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
		// Focus the "Reply" button of `elementRef.current` here.
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

	onMount()

	// `4chan.org` displays attachment thumbnails as `125px`
	// (half the size) when they're not "OP posts".
	//
	// `elementRef` is supplied by `<CommentTree/>`
	// and is used to to scroll to the parent post
	// when the user hides its replies tree.
	//
	let commentElement = (
		<Comment
			{...rest}
			elementRef={elementRef}
			mode={mode}
			comment={comment}
			threadId={threadId}
			channelId={channelId}
			channelIsNotSafeForWork={channelIsNotSafeForWork}
			locale={locale}
			urlBasePath={getBasePath()}
			onReply={showReplyAction ? onReply : undefined}
			onDoubleClick={showReplyAction ? onLongPressOrDoubleClick : undefined}
			onRenderedContentDidChange={onRenderedContentDidChange}
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
	} else if (showReplyAction) {
		commentElement = (
			<OnLongPress
				touch
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
			{!parentComment &&
				<NewAutoUpdateCommentsStartLine commentId={comment.id}/>
			}
			{commentElement}
			{!parentComment && !comment.removed &&
				<CommentReadStatusWatcher
					mode={mode}
					channelId={channelId}
					threadId={threadId}
					commentId={comment.id}
					commentIndex={comment.indexForLatestReadCommentDetection}
					unreadCommentWatcher={unreadCommentWatcher}/>
			}
			{!comment.removed &&
				replyFormElement
			}
		</div>
	)
}

CommentWrapped.propTypes = {
	id: PropTypes.string,
	mode: PropTypes.oneOf(['channel', 'thread']).isRequired,
	onClick: PropTypes.func,
	onClickUrl: PropTypes.string,
	showReplyAction: PropTypes.bool,
	threadIsLocked: PropTypes.bool,
	threadExpired: PropTypes.bool,
	comment: commentType.isRequired,
	threadId: threadId.isRequired,
	channelId: channelId.isRequired,
	channelIsNotSafeForWork: PropTypes.bool,
	locale: PropTypes.string.isRequired,
	dispatch: PropTypes.func.isRequired,
	parentComment: commentType,
	initialShowReplyForm: PropTypes.bool,
	onToggleShowReplyForm: PropTypes.func,
	onRenderedContentDidChange: PropTypes.func,
	unreadCommentWatcher: PropTypes.instanceOf(UnreadCommentWatcher).isRequired
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

function getReplyText({ commentId, threadId, quoteText }) {
	let text = '>>' + commentId
	if (commentId === threadId) {
		text += ' (OP)'
	}
	text += '\n'
	if (quoteText) {
		text += '>' + quoteText
		text += '\n'
	}
	return text
}