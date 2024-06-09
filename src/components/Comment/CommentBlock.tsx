import type {
	EasyReactFormState,
	CommentId,
	ThreadId,
	ChannelId,
	Comment,
	Thread,
	Mode,
	Messages,
	Attachment,
	Props,
	Channel
} from '@/types'

import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import {
	comment as commentType,
	thread as threadType,
	threadId,
	channelId
} from '../../PropTypes.js'

import NewAutoUpdateCommentsStartLine from './NewAutoUpdateCommentsStartLine.js'
import PostForm, { POST_FORM_INPUT_FIELD_NAME } from '../PostFormWithAttachments.js'
import CommentReadStatusWatcher from './CommentReadStatusWatcher.js'
import CommentWithOptionalThumbnail from './CommentWithOptionalThumbnail.js'
import CommentWithOptionalThumbnailClickableWrapper from './CommentWithOptionalThumbnailClickableWrapper.js'

import useReply from './useReply.js'
import useReport from './useReport.js'
import useHide from './useHide.js'
import useOwn from './useOwn.js'

import useUrlBasePath from '../../hooks/useUrlBasePath.js'

import './CommentBlock.css'

export default function CommentBlock({
	id,
	comment,
	getThread,
	threadId,
	channel,
	channelId,
	mode,
	messages,
	parentComment,
	threadIsTrimming,
	threadIsArchived,
	threadIsLocked,
	threadExpired,
	initialShowReplyForm,
	onShowReplyFormChange,
	onRenderedContentDidChange,
	unreadCommentWatcher,
	latestSeenThreadId,
	channelContainsExplicitContent,
	canReply,
	onClick,
	onCommentOwnershipStatusChange,
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
	isFirstThreadInTheList,
	refreshThread,
	...rest
}: {
	id?: string,
	comment: Comment,
	getThread: () => Thread,
	threadId: ThreadId,
	channel: Channel,
	channelId: ChannelId,
	mode: Mode,
	messages: Messages,
	parentComment?: Comment,
	threadIsTrimming?: boolean,
	threadIsArchived?: boolean,
	threadIsLocked?: boolean,
	threadExpired?: boolean,
	initialShowReplyForm?: boolean,
	onShowReplyFormChange?: (showReplyForm: boolean) => boolean,
	onRenderedContentDidChange: () => void,
	unreadCommentWatcher: {
		watch: (element: Element) => () => void
	},
	latestSeenThreadId?: ThreadId,
	channelContainsExplicitContent?: boolean,
	canReply?: boolean,
	onClick: (commentId: CommentId, threadId: ThreadId, channelId: ChannelId) => void,
	onCommentOwnershipStatusChange?: (commentId: CommentId, threadId: ThreadId, channelId: ChannelId, isOwn: boolean) => void,
	initialHidden?: boolean,
	setHidden: (hidden: boolean) => void,
	initialReplyFormInputHeight?: number,
	onReplyFormInputHeightDidChange?: (height: number) => void,
	initialReplyFormError?: string,
	onReplyFormErrorDidChange?: (error: string) => void,
	initialReplyFormState?: EasyReactFormState,
	onReplyFormStateDidChange?: (state: EasyReactFormState) => void,
	initialReplyFormFiles?: { id: number, file: File }[],
	onReplyFormFilesDidChange?: (replyFormFiles: { id: number, file: File }[]) => void,
	initialReplyFormAttachments?: Attachment[],
	onReplyFormAttachmentsDidChange?: (attachments: Attachment[]) => void,
	showSeparatorLineBetweenTopLevelComments?: boolean,
	isFirstThreadInTheList?: boolean,
	refreshThread?: () => void
} & Omit<Props<typeof CommentWithOptionalThumbnail>,
	'threadId' |
	'channelId' |
	'parentComment' |
	'mode' |
	'messages' |
	'hidden' |
	'onHide' |
	'onReply' |
	'onReport' |
	'isOwn' |
	'setOwn' |
	'urlBasePath' |
	'onRenderedContentDidChange' |
	'channelContainsExplicitContent' |
	'moreActionsButtonRef' |
	'clickableElementProps'
>) {
	const urlBasePath = useUrlBasePath()

	// This button gets focused when the user clicks the "Cancel" button
	// on the reply form under this comment.
	const moreActionsButtonRef = useRef()

	const {
		isOwn,
		setOwn
	} = useOwn({
		channelId,
		threadId,
		commentId: comment.id,
		mode,
		onCommentOwnershipStatusChange
	})

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
		getThread,
		threadId,
		channel,
		channelId,
		channelContainsExplicitContent,
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
		refreshThread
	})

	const {
		onReport
	} = useReport({
		channelId,
		threadId,
		commentId: comment.id
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
			{/* Doesn't render "Previously seen threads:" element for now */}
			{mode === 'channel' && latestSeenThreadId && comment.id === latestSeenThreadId && false &&
				<div className="Comment-previouslySeenThreadsBanner">
					{messages.previouslySeenThreads}
				</div>
			}

			<div className={classNames('Comment-spacer', {
				'Comment-spacer--topLevel': !parentComment,
				'Comment-spacer--aboveFirstSpacerLine': showSeparatorLineBetweenTopLevelComments && isFirstThreadInTheList && comment.id === threadId
			})}/>

			{!parentComment && showSeparatorLineBetweenTopLevelComments &&
				<>
					{/* When using `virtual-scroller`, all items must have the same
					    paddings/margins/borders, so the spacer line above the first comment
					    can't just be marked as `display: none`. Instead, it should be
					    visually hidden, for example, by making it transparent.
					*/}
					<hr className={classNames('Comment-spacerLine', {
						'Comment-spacerLine--first': isFirstThreadInTheList && comment.id === threadId
					})}/>
					<div className="Comment-spacer"/>
				</>
			}

			{mode === 'thread' && !parentComment &&
				<NewAutoUpdateCommentsStartLine commentId={comment.id}/>
			}

			<CommentWithOptionalThumbnailClickableWrapper
				comment={comment}
				threadId={threadId}
				channelId={channelId}
				onClick={hidden ? onUnHide : onClick}
				onReply={onReply}>
				{(clickableElementProps) => (
					<CommentWithOptionalThumbnail
						{...rest}
						comment={comment}
						threadId={threadId}
						channelId={channelId}
						parentComment={parentComment}
						mode={mode}
						messages={messages}
						hidden={hidden}
						onHide={onHide}
						onReply={onReply}
						onReport={onReport}
						isOwn={isOwn}
						setOwn={setOwn}
						urlBasePath={urlBasePath}
						onRenderedContentDidChange={onRenderedContentDidChange}
						channelContainsExplicitContent={channelContainsExplicitContent}
						moreActionsButtonRef={moreActionsButtonRef}
						clickableElementProps={clickableElementProps}
					/>
				)}
			</CommentWithOptionalThumbnailClickableWrapper>

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
					<div className="Comment-spacer Comment-spacer--aboveReplyForm"/>

					<div className="Comment-replyFormContainer">
						<PostForm
							ref={replyForm}
							expanded
							placement="comment"
							commentId={comment.id}
							threadId={threadId}
							channelId={channelId}
							channelContainsExplicitContent={channelContainsExplicitContent}
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
					</div>
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
	getThread: PropTypes.func.isRequired,
	threadId: threadId.isRequired,
	channelId: channelId.isRequired,
	messages: PropTypes.object.isRequired,
	parentComment: commentType,
	initialShowReplyForm: PropTypes.bool,
	onShowReplyFormChange: PropTypes.func,
	onRenderedContentDidChange: PropTypes.func,
	unreadCommentWatcher: PropTypes.any,
	// // This property type definition produced a mismatch warning on hot reload.
	// unreadCommentWatcher: PropTypes.instanceOf(UnreadCommentWatcher),
	latestSeenThreadId: threadId,
	channelContainsExplicitContent: PropTypes.bool,
	canReply: PropTypes.bool,
	onClick: PropTypes.func,
	onCommentOwnershipStatusChange: PropTypes.func,
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
	isFirstThreadInTheList: PropTypes.bool
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
