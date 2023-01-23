import React from 'react'
import PropTypes from 'prop-types'

import {
	comment as commentType,
	threadId,
	channelId
} from '../../PropTypes.js'

import NewAutoUpdateCommentsStartLine from './NewAutoUpdateCommentsStartLine.js'
import PostForm from '../PostForm.js'
import CommentReadStatusWatcher from './CommentReadStatusWatcher.js'
import CommentWithThumbnail from './CommentWithThumbnail.js'
import CommentWithThumbnailClickableWrapper from './CommentWithThumbnailClickableWrapper.js'

import useReply from './useReply.js'
import useHide from './useHide.js'

import getMessages from '../../messages/index.js'
import UnreadCommentWatcher from '../../utility/comment/UnreadCommentWatcher.js'
import getBasePath from '../../utility/getBasePath.js'

import './CommentBlock.css'

export default function CommentBlock({
	id,
	comment,
	threadId,
	channelId,
	mode,
	locale,
	parentComment,
	threadIsTrimming,
	threadIsArchived,
	threadIsLocked,
	threadExpired,
	initialShowReplyForm,
	onShowReplyFormChange,
	onRenderedContentDidChange,
	onSubscribeToThread,
	unreadCommentWatcher,
	latestSeenThreadId,
	channelIsNotSafeForWork,
	canReply,
	onClick,
	initialHidden,
	setHidden,
	...rest
}) {
	const {
		replyForm,
		showReplyForm,
		onReply,
		onCancelReply,
		onSubmitReply
	} = useReply({
		comment,
		threadId,
		channelId,
		channelIsNotSafeForWork,
		threadIsArchived,
		threadIsLocked,
		threadExpired,
		// Other properties.
		canReply,
		initialShowReplyForm,
		onShowReplyFormChange,
		onAfterShowOrHideReplyForm: onRenderedContentDidChange,
		locale
	})

	const {
		hidden,
		onHide,
		onUnHide
	} = useHide({
		comment,
		threadId,
		channelId,
		initialHidden,
		setHidden,
		onAfterHiddenChange: onRenderedContentDidChange
	})

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

			<CommentWithThumbnailClickableWrapper
				comment={comment}
				threadId={threadId}
				channelId={channelId}
				onClick={hidden ? onUnHide : onClick}
				onReply={onReply}>

				<CommentWithThumbnail
					{...rest}
					comment={comment}
					threadId={threadId}
					channelId={channelId}
					parentComment={parentComment}
					mode={mode}
					locale={locale}
					hidden={hidden}
					onHide={onHide}
					onReply={onReply}
					urlBasePath={getBasePath()}
					onRenderedContentDidChange={onRenderedContentDidChange}
					channelIsNotSafeForWork={channelIsNotSafeForWork}
				/>
			</CommentWithThumbnailClickableWrapper>

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

CommentBlock.propTypes = {
	id: PropTypes.string,
	mode: PropTypes.oneOf(['channel', 'thread']).isRequired,
	threadIsTrimming: PropTypes.bool,
	threadIsArchived: PropTypes.bool,
	threadIsLocked: PropTypes.bool,
	threadExpired: PropTypes.bool,
	comment: commentType.isRequired,
	threadId: threadId.isRequired,
	channelId: channelId.isRequired,
	locale: PropTypes.string.isRequired,
	parentComment: commentType,
	initialShowReplyForm: PropTypes.bool,
	onShowReplyFormChange: PropTypes.func,
	onRenderedContentDidChange: PropTypes.func,
	onSubscribeToThread: PropTypes.func,
	unreadCommentWatcher: PropTypes.any,
	// // This property type definition produced a mismatch warning on hot reload.
	// unreadCommentWatcher: PropTypes.instanceOf(UnreadCommentWatcher),
	latestSeenThreadId: threadId,
	channelIsNotSafeForWork: PropTypes.bool,
	canReply: PropTypes.bool,
	onClick: PropTypes.func,
	initialHidden: PropTypes.bool,
	setHidden: PropTypes.func.isRequired
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