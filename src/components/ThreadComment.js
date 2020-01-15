import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import {
	comment as commentType,
	thread as threadType,
	board as boardType
} from '../PropTypes'

import { getMaxPostAttachmentThumbnailWidth } from '../utility/postThumbnail'
import getCommentLengthLimit from '../utility/getCommentLengthLimit'

import ArhivachIcon from '../../assets/images/icons/services/arhivach.svg'

import PostForm from './PostForm'
import Header, { HEADER_BADGES, hasAuthor } from './ThreadCommentHeader'
import { hasReplies, getFooterBadges } from './ThreadCommentFooter'
import ThreadCommentHidden from './ThreadCommentHidden'
import CommentReadStatusWatcher from './CommentReadStatusWatcher'

import Post from 'webapp-frontend/src/components/Post'
import OnClick from 'webapp-frontend/src/components/OnClick'
import PostAttachment from 'webapp-frontend/src/components/PostAttachment'
import { isSlideSupported } from 'webapp-frontend/src/components/Slideshow'
import PictureStack from 'webapp-frontend/src/components/PictureStack'

import getNonEmbeddedAttachments from 'social-components/commonjs/utility/post/getNonEmbeddedAttachments'
import getPostThumbnailAttachment, { getPostThumbnailSize } from 'social-components/commonjs/utility/post/getPostThumbnail'
import getSortedAttachments from 'social-components/commonjs/utility/post/getSortedAttachments'

import { vote as voteForComment } from '../redux/chan'
import { notify } from 'webapp-frontend/src/redux/notifications'
import { openSlideshow } from 'webapp-frontend/src/redux/slideshow'

import openLinkInNewTab from 'webapp-frontend/src/utility/openLinkInNewTab'
import copyTextToClipboard from 'webapp-frontend/src/utility/clipboard'

import { getChan, getCommentUrl } from '../chan'
import getMessages from '../messages'
import getBasePath from '../utility/getBasePath'
import getUrl from '../utility/getUrl'
import configuration from '../configuration'

import './ThreadComment.css'

// `ThreadComment` is a class because `virtual-scroller` requires
// its `component` to be a React.Component in order to assign a `ref`
// that could be used for calling `.renderItem(i)` manually.
// (which is done when YouTube/Twitter/etc links are loaded)
export default function ThreadComment({
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
	scrollToComment,
	className,
	...rest
}) {
	const [hidden, setHidden] = useState(comment.hidden)
	const [showReplyForm, setShowReplyForm] = useState(initialShowReplyForm)
	const [vote, setVote] = useState(comment.vote)
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

	const toggleShowHide = useCallback(
		() => setHidden(!hidden),
		[hidden]
	)

	const onClick = useCallback((event) => {
		event.preventDefault()
		onClick_(comment, thread, board)
	}, [onClick_, comment])

	const onVote = useCallback(async (up) => {
		try {
			const voteAccepted = await dispatch(voteForComment({
				boardId: board.id,
				threadId: thread.id,
				commentId: comment.id,
				up
			}))
			if (voteAccepted) {
				if (up) {
					comment.upvotes++
				} else {
					comment.downvotes++
				}
			} else {
				dispatch(notify(getMessages(locale).post.alreadyVoted))
			}
			// If the vote has been accepted then mark this comment as "voted".
			// If the vote hasn't been accepted due to "already voted"
			// then also mark this comment as "voted".
			comment.vote = up
			setVote(comment.vote)
		} catch (error) {
			dispatch(notify(error.message, { type: 'error' }))
		}
	}, [board, thread, comment, dispatch])

	const onReply = useCallback(() => {
		dispatch(notify(getMessages(locale).notImplemented))
		openLinkInNewTab(getCommentUrl(board, thread, comment))
		// if (showReplyForm) {
		// 	replyForm.current.focus()
		// } else {
		// 	setShowReplyForm(true)
		// }
	}, [board, thread, comment, locale, dispatch])

	const onCancelReply = useCallback(() => {
		setShowReplyForm(false)
		// Reset the draft in `localStorage` here.
	}, [comment])

	const onSubmitReply = useCallback(({ content }) => {
		dispatch(notify(getMessages(locale).notImplemented))
		// Disable reply form.
		// Show a spinner.
		// Wait for the new comment to be fetched as part of thread auto-update.
		// Hide the reply form.
		// Focus the "Reply" button of `postRef.current` here.
	}, [comment, locale])

	const onAttachmentClick = useCallback((attachment, options = {}) => {
		// Remove `spoiler: true` so that a once revealed spoiler isn't shown again
		// when "Show previous" button is clicked and `<PostAttachment/>` is
		// unmounted resulting in its `isRevealed: true` state property being reset.
		if (attachment.spoiler) {
			delete attachment.spoiler
		}
		// `<PostLink/>` doesn't provide `options` (and `thumbnailImage` as part of it).
		const { thumbnailImage } = options
		// The attachment clicked might be a `link` attachment
		// that's not part of `post.attachments` (that can be `undefined`).
		let attachments
		let i = -1
		if (comment.attachments) {
			attachments = getSortedAttachments(comment).filter(isSlideSupported)
			i = attachments.indexOf(attachment)
		}
		// If an attachment is either an uploaded one or an embedded one
		// then it will be in `post.attachments`.
		// If an attachment is only attached to a `link`
		// (for example, an inline-level YouTube video link)
		// then it won't be included in `post.attachments`.
		if (i >= 0) {
			dispatch(openSlideshow(attachments, i, { thumbnailImage }))
		} else {
			dispatch(openSlideshow([attachment], 0, { thumbnailImage }))
		}
	}, [comment, dispatch])

	const onPostLinkClick = useCallback((event, {
		postWasDeleted,
		postIsExternal,
		boardId,
		threadId,
		postId
	}) => {
		if (!postIsExternal) {
			if (boardId === board.id && threadId === thread.id) {
				event.preventDefault()
				scrollToComment(postId, comment.id)
			}
		}
	}, [board, thread, comment])

	const isPostLinkClickable = useCallback(({ postWasDeleted }) => !postWasDeleted, [])

	// `4chan.org` displays attachment thumbnails as `125px`
	// (half the size) when they're not "OP posts".
	// `postRef` is supplied by `<CommentTree/>`
	// and is used to focus stuff on toggle reply form.
	const commentElement = (
		<Comment
			{...rest}
			postRef={postRef}
			mode={mode}
			isFirstPostInThread={comment.id === thread.id}
			comment={comment}
			thread={thread}
			board={board}
			hidden={hidden}
			toggleShowHide={toggleShowHide}
			locale={locale}
			url={getUrl(board, thread, comment)}
			urlBasePath={getBasePath()}
			onAttachmentClick={onAttachmentClick}
			onPostLinkClick={onPostLinkClick}
			isPostLinkClickable={isPostLinkClickable}
			onReply={mode === 'thread' && !thread.isLocked ? onReply : undefined}
			onVote={board.hasVoting ? onVote : undefined}
			vote={vote}
			dispatch={dispatch}
			parentComment={parentComment}
			className={classNames(className, `thread-comment--${mode}`, {
				'thread-comment--opening': mode === 'thread' && comment.id === thread.id
			})}/>
	)

	// `id` HTML attribute is intentionally "#comment-{commentId}"
	// and not "#{commentId}" as in "post-link"s, because otherwise
	// when navigating "post-link"s a web browser would scroll down
	// to the comment, and besides that the floating header would
	// obstruct the top of the comment.
	const id = parentComment ? undefined : 'comment-' + comment.id

	// Not using a `<Link/>` here because "<a> cannot appear as a descendant of <a>".
	// if (!onClick_ && onClickUrl) {
	// 	return (
	// 		<Link
	// 			id={id}
	// 			to={onClickUrl}
	// 			onClickClassName="thread-comment__container--click"
	// 			className="thread-comment__container">
	// 			{commentElement}
	// 		</Link>
	// 	)
	// }

	if (onClick_) {
		return (
			<OnClick
				id={id}
				filter={commentOnClickFilter}
				onClick={onClick_ ? onClick : undefined}
				url={getBasePath() + onClickUrl}
				onClickClassName="thread-comment__container--click"
				className="thread-comment__container">
				{commentElement}
			</OnClick>
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
			className="thread-comment__container">
			{commentElement}
			{replyFormElement}
		</div>
	)
}

ThreadComment.propTypes = {
	mode: PropTypes.oneOf(['board', 'thread']),
	onClick: PropTypes.func,
	onClickUrl: PropTypes.string,
	board: PropTypes.shape({
		id: PropTypes.string.isRequired
	}).isRequired,
	thread: PropTypes.shape({
		id: PropTypes.string.isRequired
	}).isRequired,
	comment: commentType.isRequired,
	thread: threadType.isRequired,
	board: boardType.isRequired,
	locale: PropTypes.string.isRequired,
	dispatch: PropTypes.func.isRequired,
	parentComment: post,
	initialShowReplyForm: PropTypes.bool,
	onToggleShowReplyForm: PropTypes.func,
	onContentDidChange: PropTypes.func,
	scrollToComment: PropTypes.func.isRequired
}

function Comment({
	mode,
	comment,
	thread,
	board,
	hidden,
	isFirstPostInThread,
	toggleShowHide,
	showingReplies,
	onToggleShowReplies,
	toggleShowRepliesButtonRef,
	onAttachmentClick,
	onPostLinkClick,
	parentComment,
	postRef,
	dispatch,
	locale,
	compact,
	screenWidth,
	expandAttachments,
	className,
	...rest
}) {
	const footerBadges = useMemo(() => getFooterBadges(comment, {
		parentComment,
		showingReplies,
		onToggleShowReplies,
		toggleShowRepliesButtonRef
	}), [comment, showingReplies])
	let postThumbnail
	const showPostThumbnailWhenThereAreMultipleAttachments = mode === 'board' ||
		(mode === 'thread' && isFirstPostInThread)
	// React hooks don't allow `if`/`else`.
	// if (!expandAttachments) {
		postThumbnail = useMemo(() => {
			return getPostThumbnailAttachment(comment, {
				showPostThumbnailWhenThereAreMultipleAttachments
			})
		}, [comment, showPostThumbnailWhenThereAreMultipleAttachments])
	// }
	// React hooks don't allow `if`/`else`,
	// so this is a workaround.
	if (expandAttachments) {
		postThumbnail = undefined;
	}
	const postThumbnailOnClick = useCallback((event) => {
		if (onAttachmentClick) {
			const attachments = getNonEmbeddedAttachments(comment)
			onAttachmentClick(
				postThumbnail,
				{ thumbnailImage: event.target }
			)
		}
	}, [postThumbnail])
	const postThumbnailMoreAttachmentsCount = useMemo(() => {
		if (postThumbnail && mode === 'board' && comment.attachments.length > 1) {
			return getNonEmbeddedAttachments(comment).length - 1
		}
	}, [postThumbnail, mode, comment])
	const moreActions = useMemo(() => {
		return [
			{
				label: getMessages(locale).post.moreActions.copyUrl,
				onClick: () => {
					copyTextToClipboard(getBasePath() + getUrl(board, thread, comment))
				}
			},
			{
				label: getMessages(locale).post.moreActions.report,
				onClick: () => dispatch(notify(getMessages(locale).notImplemented))
			},
			{
				label: getMessages(locale).post.moreActions.hide,
				onClick: () => dispatch(notify(getMessages(locale).notImplemented))
			},
			{
				label: getMessages(locale).post.moreActions.ignoreAuthor,
				onClick: () => dispatch(notify(getMessages(locale).notImplemented))
			}
		]
	}, [dispatch, locale, board, thread, comment])
	const commentClassName = 'thread-comment__comment'
	const shouldFixAttachmentPictureSize = mode === 'board' && comment.attachments && comment.attachments.length === 1 && comment.attachments[0].isLynxChanCatalogAttachmentsBug
	let postThumbnailElement
	if (postThumbnail) {
		postThumbnailElement = (
			<PostAttachment
				useSmallestThumbnail
				attachment={postThumbnail}
				spoilerLabel={getMessages(locale).post && getMessages(locale).post.spoiler}
				onClick={postThumbnailOnClick}
				fixAttachmentPictureSize={shouldFixAttachmentPictureSize}/>
		)
		if (postThumbnailMoreAttachmentsCount) {
			// A container `<div/>` is used so that the `<PictureStack/>`
			// isn't stretched to the full height of the comment,
			// because `.thread-comment__thumbnail` is `display: flex`.
			postThumbnailElement = (
				<div>
					<PictureStack count={postThumbnailMoreAttachmentsCount + 1}>
						{postThumbnailElement}
					</PictureStack>
				</div>
			)
		}
	}
	// `postRef` is supplied by `<CommentTree/>`
	// and is used to focus stuff on toggle reply form.
	const postElement = hidden ? (
		<ThreadCommentHidden
			comment={comment}
			locale={locale}
			onShow={toggleShowHide}
			className={commentClassName}/>
	) : (
		<Post
			{...rest}
			ref={postRef}
			post={comment}
			expandAttachments={expandAttachments}
			hideRestAttachments={mode === 'board'}
			compact={mode === 'thread' && !isFirstPostInThread}
			stretch
			header={Header}
			locale={locale}
			genericMessages={getMessages(locale)}
			messages={getMessages(locale).post}
			moreActions={moreActions}
			showingReplies={showingReplies}
			onShowReplies={hasReplies(comment, parentComment) ? onToggleShowReplies : undefined}
			toggleShowRepliesButtonRef={toggleShowRepliesButtonRef}
			headerBadges={HEADER_BADGES}
			footerBadges={footerBadges}
			useSmallestThumbnailsForAttachments
			serviceIcons={SERVICE_ICONS}
			youTubeApiKey={configuration.youtube && configuration.youtube.apiKey}
			expandFirstPictureOrVideo={false}
			maxAttachmentThumbnails={false}
			contentMaxLength={getCommentLengthLimit(mode)}
			onAttachmentClick={onAttachmentClick}
			onPostLinkClick={onPostLinkClick}
			fixAttachmentPictureSizes={shouldFixAttachmentPictureSize}
			showPostThumbnailWhenThereAreMultipleAttachments={showPostThumbnailWhenThereAreMultipleAttachments}
			className={commentClassName}/>
	)
	const postStyle = useMemo(() => {
		if (postThumbnail) {
			const size = getPostThumbnailSize(postThumbnail)
			return {
				// width: size.width + 'px',
				// minWidth: size.width + 'px',
				// marginLeft: (getMaxPostAttachmentThumbnailWidth() - size.width) + 'px'
				'--PostThumbnail-width': size.width + 'px'
			}
		}
	}, [comment])
	return (
		<React.Fragment>
			<div className="thread-comment__margin"/>
			<div
				style={postStyle}
				className={classNames(className, 'thread-comment', 'thread-comment--thumbnail', {
					'thread-comment--titled': comment.title,
					'thread-comment--authored': hasAuthor(comment),
					'thread-comment--compact': compact,
					'thread-comment--hidden': hidden,
					'thread-comment--has-thumbnail': postThumbnail,
					'thread-comment--has-no-thumbnail': !postThumbnail,
					'thread-comment--last': thread.comments[thread.comments.length - 1].id === comment.id,
					'content-section': mode === 'board'
				})}>
				<div
					className="thread-comment__thumbnail">
					{postThumbnailElement}
				</div>
				{postElement}
			</div>
			<CommentReadStatusWatcher
				mode={mode}
				boardId={board.id}
				threadId={thread.id}
				commentId={comment.id}
				commentIndex={thread.comments.indexOf(comment)}
				threadUpdatedAt={thread.updatedAt}/>
		</React.Fragment>
	)
	// commentCreatedAt={comment.createdAt}
	// commentUpdatedAt={comment.updatedAt}
}

Comment.propTypes = {
	mode: PropTypes.oneOf(['board', 'thread']),
	comment: commentType.isRequired,
	thread: threadType.isRequired,
	board: boardType.isRequired,
	expandAttachments: PropTypes.bool,
	hidden: PropTypes.bool,
	isFirstPostInThread: PropTypes.bool,
	toggleShowHide: PropTypes.func.isRequired,
	locale: PropTypes.string.isRequired,
	parentComment: post,
	showingReplies: PropTypes.bool,
	onToggleShowReplies: PropTypes.func,
	toggleShowRepliesButtonRef: PropTypes.any,
	// `postRef` is supplied by `<CommentTree/>`
	// and is used to focus stuff on toggle reply form.
	postRef: PropTypes.any,
	className: PropTypes.string
}

function commentOnClickFilter(element) {
	if (element.classList.contains('post__inline-spoiler-contents')) {
		if (element.parentNode.dataset.hide) {
			return false
		}
	}
	return true
}

const SERVICE_ICONS = {
	'arhivach': ArhivachIcon,
	'2ch': getChan('2ch').logo,
	'4chan': getChan('4chan').logo
}