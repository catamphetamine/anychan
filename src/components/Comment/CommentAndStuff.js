import React, { useState, useRef, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import {
	comment as commentType,
	threadId,
	channelId
} from '../../PropTypes.js'

import Clickable from 'frontend-lib/components/Clickable.js'
import OnLongPress from 'frontend-lib/components/OnLongPress.js'

import Comment from './Comment.js'
import CommentReadStatusWatcher from './CommentReadStatusWatcher.js'
import NewAutoUpdateCommentsStartLine from './NewAutoUpdateCommentsStartLine.js'
import PostForm from '../PostForm.js'

import useEffectSkipMount from 'frontend-lib/hooks/useEffectSkipMount.js'
import { notify } from '../../redux/notifications.js'
import { openLinkInNewTab } from 'web-browser-input'

import { getCommentUrl, getThreadUrl } from '../../provider.js'
import getMessages from '../../messages/index.js'
import getBasePath from '../../utility/getBasePath.js'
import UnreadCommentWatcher from '../../utility/comment/UnreadCommentWatcher.js'

import { subscribeToThread } from '../../redux/subscribedThreads.js'

import './CommentAndStuff.css'

export default function CommentAndStuff({
	id,
	comment,
	threadId,
	channelId,
	channelIsNotSafeForWork,
	mode,
	locale,
	parentComment,
	showReplyAction,
	threadIsTrimming,
	threadIsArchived,
	threadIsLocked,
	threadExpired,
	onClick: onClick_,
	getOnClickUrl,
	initialShowReplyForm,
	onShowReplyFormChange,
	onRenderedContentDidChange,
	onSubscribeToThread,
	dispatch,
	elementRef,
	unreadCommentWatcher,
	latestSeenThreadId,
	...rest
}) {
	const [showReplyForm, setShowReplyForm] = useState(initialShowReplyForm)
	const replyForm = useRef()

	useEffectSkipMount(() => {
		// Update reply form expanded state in `virtual-scroller` state.
		if (onShowReplyFormChange) {
			onShowReplyFormChange(showReplyForm)
		}
		// Reply form has been toggled: update `virtual-scroller` item height.
		if (onRenderedContentDidChange) {
			onRenderedContentDidChange()
		}
		if (!showReplyForm) {
			console.log('.focus() the "Reply" button of `elementRef.current` here.')
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
		if (threadIsArchived) {
			return dispatch(notify(getMessages(locale).threadIsArchived))
		}
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
				notSafeForWork: channelIsNotSafeForWork
			})
		} else {
			url = getCommentUrl(channelId, threadId, comment.id, {
				notSafeForWork: channelIsNotSafeForWork
			})
		}

		// try {
		// 	const commentId = await createComment(text, {
		// 		channelId,
		// 		threadId
		// 	})
		// 	const latestReadCommentId = UserData.getLatestReadCommentId(channelId, threadId)
		// 	const hasMoreUnreadComments = latestReadCommentId < thread.comments[thread.comments.length - 1]
		// 	if (!hasMoreUnreadComments) {
		// 		UserData.setLatestReadCommentId(channelId, threadId, commentId)
		// 	}
		// 	UserData.addOwnComment(channelId, threadId, commentId)
		// 	if (!UserData.getSubscribedThread(channelId, threadId)) {
		// 		onSubscribeToThread()
		// 	}
		// 	await dispatch(triggerAutoUpdateThreadRefreshIfAutoUpdateIsRunningOrRefreshThreadAndMaybeStartAutoUpdate())
		// } catch (error) {
		// 	console.error(error)
		// 	return notifyError(error)
		// }

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
			parentComment={parentComment}
		/>
	)

	// Potentially set an HTML `id` attribute for the comment element.
	if (id === undefined) {
		// When `parentComment` property is defined, it means that the comment
		// is being rendered as part of an expandable tree of replies.
		// In that case, the `id` attribute shouldn't be set on that comment's HTML element
		// because there potentially may be several such elements on a page.
		if (!parentComment) {
			// `id` HTML attribute is intentionally set as "#comment-{commentId}"
			// and not as "#{commentId}", because otherwise, when navigating to a "post-link" URL,
			// a web browser would scroll down to the comment's HTML element, and the floating header
			// would obstruct the very top of the comment element.
			// Instead, when navigating to a "post-link" URL, this application simply
			// shows the comments starting from that one, removing the requirement for scrolling.
			id = 'comment-' + comment.id
		}
	}

	// Not using a `<Link/>` here because "<a> cannot appear as a descendant of <a>".
	// if (!onClick_ && getOnClickUrl) {
	// 	return (
	// 		<Link
	// 			id={id}
	// 			to={getOnClickUrl(channelId, threadId, comment.id)}
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
				url={getBasePath() + getOnClickUrl(channelId, threadId, comment.id)}>
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

	return (
		<div id={id} className="Comment-container">
			{mode === 'channel' && latestSeenThreadId && id === latestSeenThreadId &&
				<div className="Comment-previouslySeenThreadsBanner">
					{getMessages(locale).previouslySeenThreads}
				</div>
			}
			<div className="Comment-spacer"/>
			{mode === 'thread' && !parentComment &&
				<NewAutoUpdateCommentsStartLine commentId={comment.id}/>
			}
			{commentElement}
			{!parentComment && !comment.removed && !threadExpired && unreadCommentWatcher &&
				<CommentReadStatusWatcher
					mode={mode}
					channelId={channelId}
					threadId={threadId}
					commentId={comment.id}
					commentIndex={comment.index}
					unreadCommentWatcher={unreadCommentWatcher}
				/>
			}
			{!comment.removed && showReplyForm &&
				<PostForm
					ref={replyForm}
					locale={locale}
					onCancel={onCancelReply}
					onSubmit={onSubmitReply}
				/>
			}
		</div>
	)
	// commentIndex={comment.index}
	// threadIsTrimming={threadIsTrimming}
}

CommentAndStuff.propTypes = {
	id: PropTypes.string,
	mode: PropTypes.oneOf(['channel', 'thread']).isRequired,
	onClick: PropTypes.func,
	getOnClickUrl: PropTypes.func,
	showReplyAction: PropTypes.bool,
	threadIsTrimming: PropTypes.bool,
	threadIsArchived: PropTypes.bool,
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
	onShowReplyFormChange: PropTypes.func,
	onRenderedContentDidChange: PropTypes.func,
	onSubscribeToThread: PropTypes.func,
	unreadCommentWatcher: PropTypes.any,
	// // This property type definition produced a mismatch warning on hot reload.
	// unreadCommentWatcher: PropTypes.instanceOf(UnreadCommentWatcher),
	latestSeenThreadId: threadId
}

function commentOnClickFilter(element) {
	if (element.classList.contains('PostInlineSpoiler-contents')) {
		if (element.parentNode.dataset.hide) {
			return false
		}
	}
	if (isInsideOrEqualToClassName(element, 'PostSocial--clickable', 'Clickable')) {
		return false
	}
	return true
}

function isInsideOrEqualToClassName(element, className, maxParentClassName) {
	if (!element || element.classList.contains(maxParentClassName)) {
		return false
	}
	if (element.classList.contains(className)) {
		return true
	}
	return isInsideOrEqualToClassName(element.parentNode, className, maxParentClassName)
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
	// if (commentId === threadId) {
	// 	text += ' (OP)'
	// }
	text += '\n'
	if (quoteText) {
		text += '>' + quoteText.split('\n').join('>\n')
		text += '\n'
	}
	return text
}