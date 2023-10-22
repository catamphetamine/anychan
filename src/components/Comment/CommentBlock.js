import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import {
	comment as commentType,
	threadId,
	channelId
} from '../../PropTypes.js'

import NewAutoUpdateCommentsStartLine from './NewAutoUpdateCommentsStartLine.js'
import PostForm, { POST_FORM_INPUT_FIELD_NAME } from '../PostForm.js'
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
	initialReplyFormInputHeight,
	onReplyFormInputHeightDidChange: onReplyFormInputHeightDidChange_,
	// initialReplyFormInputValue,
	// onReplyFormInputValueChange,
	initialReplyFormError,
	onReplyFormErrorDidChange: onReplyFormErrorDidChange_,
	initialReplyFormState,
	onReplyFormStateDidChange,
	initialReplyFormFiles,
	onReplyFormFilesDidChange,
	initialReplyFormAttachments,
	onReplyFormAttachmentsDidChange,
	showSeparatorLineBetweenTopLevelComments,
	isFirstItemInTheList,
	...rest
}) {
	// This button gets focused when the user clicks the "Cancel" button
	// on the reply form under this comment.
	const moreActionsButtonRef = useRef()

	const {
		replyForm,
		replyFormInitialText,
		showReplyForm,
		onReply,
		onCancelReply,
		onSubmitReply,
		onReplyFormErrorDidChange,
		onReplyFormInputHeightDidChange
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
		replyFormInputFieldName: POST_FORM_INPUT_FIELD_NAME,
		initialShowReplyForm,
		onShowReplyFormChange,
		onReplyFormInputHeightDidChange: onReplyFormInputHeightDidChange_,
		onReplyFormErrorDidChange: onReplyFormErrorDidChange_,
		onRenderedContentDidChange,
		moreActionsButtonRef,
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
		// `initialHidden` should be passed as a property
		// and not read from `userData.isCommentHidden()`.
		// The reason is that the result of `userData.isCommentHidden()`
		// will change dynamically when the user hides or un-hides the comment
		// while `virtual-scroller` requires all list items be "idempotent"
		// (i.e. produce the same rendered element provided the same item object)
		// and not depend on any outside sources of data:
		// they can only use their `item` object as the only source of data.
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

			{!parentComment && showSeparatorLineBetweenTopLevelComments &&
				<>
					{/* When using `virtual-scroller`, all items must have the same
					    paddings/margins/borders, so the spacer line above the first comment
					    can't just be marked as `display: none`. Instead, it should be
					    visually hidden, for example, by making it transparent.
					*/}
					<hr className={classNames('Comment-spacerLine', {
						'Comment-spacerLine--first': isFirstItemInTheList
					})}/>
					<div className="Comment-spacer"/>
				</>
			}

			{mode === 'thread' && !parentComment &&
				<NewAutoUpdateCommentsStartLine commentId={comment.id}/>
			}

			<CommentWithThumbnailClickableWrapper
				comment={comment}
				threadId={threadId}
				channelId={channelId}
				onClick={hidden ? onUnHide : onClick}
				onReply={onReply}>
				{(clickableElementProps) => (
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
						moreActionsButtonRef={moreActionsButtonRef}
						clickableElementProps={clickableElementProps}
					/>
				)}
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

			{/*
			initialInputValue={initialReplyFormInputValue}
			onInputValueChange={onReplyFormInputValueChange}
			*/}

			{showReplyForm &&
				<>
					<div className="Comment-spacer"/>

					<PostForm
						ref={replyForm}
						placement="comment"
						locale={locale}
						initialInputValue={replyFormInitialText}
						initialState={initialReplyFormState}
						onStateDidChange={onReplyFormStateDidChange}
						initialError={initialReplyFormError}
						onErrorDidChange={onReplyFormErrorDidChange}
						initialInputHeight={initialReplyFormInputHeight}
						onInputHeightDidChange={onReplyFormInputHeightDidChange}
						initialFiles={initialReplyFormFiles}
						onFilesDidChange={onReplyFormFilesDidChange}
						initialAttachments={initialReplyFormAttachments}
						onAttachmentsDidChange={onReplyFormAttachmentsDidChange}
						onHeightDidChange={onRenderedContentDidChange}
						onCancel={onCancelReply}
						onSubmit={onSubmitReply}
					/>
				</>
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
	setHidden: PropTypes.func.isRequired,
	initialReplyFormError: PropTypes.string,
	onReplyFormErrorDidChange: PropTypes.func,
	initialReplyFormInputHeight: PropTypes.number,
	onReplyFormInputHeightDidChange: PropTypes.func,
	initialReplyFormState: PropTypes.object,
	onReplyFormStateDidChange: PropTypes.func,
	initialReplyFormFiles: PropTypes.arrayOf(PropTypes.object),
	onReplyFormFilesDidChange: PropTypes.func,
	initialReplyFormAttachments: PropTypes.arrayOf(PropTypes.object),
	onReplyFormAttachmentsDidChange: PropTypes.func,
	showSeparatorLineBetweenTopLevelComments: PropTypes.bool,
	isFirstItemInTheList: PropTypes.bool
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
