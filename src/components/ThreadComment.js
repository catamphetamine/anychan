import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import memoize from 'fast-memoize'

import { post } from '../PropTypes'

import ArhivachIcon from '../../assets/images/icons/services/arhivach.svg'

import PostForm from './PostForm'
import Header, { HEADER_BADGES, hasAuthor } from './ThreadCommentHeader'
import { getFooterBadges } from './ThreadCommentFooter'
import ThreadCommentHidden from './ThreadCommentHidden'

import Post from 'webapp-frontend/src/components/Post'
import OnClick from 'webapp-frontend/src/components/OnClick'
import PostAttachment from 'webapp-frontend/src/components/PostAttachment'
import getNonEmbeddedAttachments from 'webapp-frontend/src/utility/post/getNonEmbeddedAttachments'
import getPostThumbnail from 'webapp-frontend/src/utility/post/getPostThumbnail'
import getSortedAttachments from 'webapp-frontend/src/utility/post/getSortedAttachments'
import { isSlideSupported } from 'webapp-frontend/src/components/Slideshow'

import { getChan } from '../chan'
import getMessages from '../messages'
import getBasePath from '../utility/getBasePath'
import getUrl from '../utility/getUrl'
import configuration from '../configuration'

import './ThreadComment.css'

// `ThreadComment` is a class because `virtual-scroller` requires
// its `component` to be a React.Component in order to assign a `ref`
// that could be used for calling `.updateItem(i)` manually.
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
	openSlideshow,
	notify,
	postRef,
	className,
	...rest
}) {
	const [hidden, setHidden] = useState(comment.hidden)
	const [showReplyForm, setShowReplyForm] = useState(initialShowReplyForm)
	const replyForm = useRef()
	const isMounted = useRef()
	useEffect(() => {
		if (isMounted.current) {
			// Update reply form expanded state in `virtual-scroller` state.
			if (onToggleShowReplyForm) {
				onToggleShowReplyForm(value)
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

	const onVote = useCallback((vote) => {
		notify('Not implemented yet')
	}, [comment])

	const onReply = useCallback(() => {
		notify('Not implemented yet')
		// if (showReplyForm) {
		// 	replyForm.current.focus()
		// } else {
		// 	setShowReplyForm(true)
		// }
	}, [comment])

	const onCancelReply = useCallback(() => {
		setShowReplyForm(false)
		// Reset the draft in `localStorage` here.
	}, [comment])

	const onSubmitReply = useCallback(({ content }) => {
		notify('Not implemented yet')
		// Disable reply form.
		// Show a spinner.
		// Wait for the new comment to be fetched as part of thread auto-update.
		// Hide the reply form.
		// Focus the "Reply" button of `postRef.current` here.
	}, [comment])

	const onAttachmentClick = useCallback((attachment) => {
		const attachments = getSortedAttachments(comment).filter(isSlideSupported)
		const i = attachments.indexOf(attachment)
		// If an attachment is either an uploaded one or an embedded one
		// then it will be in `post.attachments`.
		// If an attachment is only attached to a `link`
		// (for example, an inline-level YouTube video link)
		// then it won't be included in `post.attachments`.
		if (i >= 0) {
			openSlideshow(attachments, i)
		} else {
			openSlideshow([attachment], 0)
		}
	}, [comment, openSlideshow])

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
			hidden={hidden}
			toggleShowHide={toggleShowHide}
			locale={locale}
			url={getUrl(board, thread, comment)}
			onAttachmentClick={onAttachmentClick}
			onReply={mode === 'thread' && !thread.isLocked ? onReply : undefined}
			onVote={thread.hasVoting ? onVote : undefined}
			notify={notify}
			parentComment={parentComment}
			className={classNames(className, `thread-comment--${mode}`, {
				'thread-comment--opening': mode === 'thread' && comment.id === thread.id
			})}/>
	)

	const id = parentComment ? undefined : comment.id

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
				url={(getBasePath() || '') + onClickUrl}
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
	getUrl: PropTypes.func.isRequired,
	onClick: PropTypes.func,
	onClickUrl: PropTypes.string,
	board: PropTypes.shape({
		id: PropTypes.string.isRequired
	}).isRequired,
	thread: PropTypes.shape({
		id: PropTypes.string.isRequired
	}).isRequired,
	comment: post.isRequired,
	locale: PropTypes.string.isRequired,
	openSlideshow: PropTypes.func.isRequired,
	notify: PropTypes.func.isRequired,
	parentComment: post,
	initialShowReplyForm: PropTypes.bool,
	onToggleShowReplyForm: PropTypes.func,
	onContentDidChange: PropTypes.func
}

function Comment({
	mode,
	comment,
	hidden,
	isFirstPostInThread,
	toggleShowHide,
	showingReplies,
	onToggleShowReplies,
	toggleShowRepliesButtonRef,
	onAttachmentClick,
	parentComment,
	postRef,
	notify,
	locale,
	compact,
	screenWidth,
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
	if (!rest.expandAttachments) {
		postThumbnail = getPostThumbnailMemoized(comment, {
			showPostThumbnailWhenThereAreMultipleAttachments
		})
	}
	const postThumbnailOnClick = useCallback(() => {
		if (onAttachmentClick) {
			const attachments = getNonEmbeddedAttachments(comment)
			onAttachmentClick(
				postThumbnail,
				attachments.indexOf(postThumbnail),
				attachments
			)
		}
	}, [postThumbnail])
	const onMoreActions = useCallback(() => {
		notify('Not implemented yet')
	}, [])
	const commentClassName = 'thread-comment__comment'
	const shouldFixAttachmentPictureSize = mode === 'board' && comment.attachments && comment.attachments.length === 1 && comment.attachments[0].isLynxChanCatalogAttachmentsBug
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
			compact={mode === 'thread' && !isFirstPostInThread}
			stretch
			header={Header}
			locale={locale}
			genericMessages={getMessages(locale)}
			messages={getMessages(locale).post}
			onMoreActions={onMoreActions}
			headerBadges={HEADER_BADGES}
			footerBadges={footerBadges}
			useSmallestThumbnailsForAttachments
			serviceIcons={SERVICE_ICONS}
			youTubeApiKey={configuration.youtube && configuration.youtube.apiKey}
			expandFirstPictureOrVideo={false}
			maxAttachmentThumbnails={false}
			commentLengthLimit={mode === 'thread' ? configuration.commentLengthLimit : configuration.commentLengthLimitForThreadPreview}
			onAttachmentClick={onAttachmentClick}
			fixAttachmentPictureSizes={shouldFixAttachmentPictureSize}
			showPostThumbnailWhenThereAreMultipleAttachments={showPostThumbnailWhenThereAreMultipleAttachments}
			className={commentClassName}/>
	)
	return (
		<div
			className={classNames(className, 'thread-comment', 'thread-comment--thumbnail', {
				'thread-comment--titled': comment.title,
				'thread-comment--authored': hasAuthor(comment),
				'thread-comment--compact': compact,
				'thread-comment--hidden': hidden,
				'thread-comment--has-thumbnail': postThumbnail,
				'thread-comment--has-no-thumbnail': !postThumbnail,
				'content-section': mode === 'board'
			})}>
			<div className="thread-comment__thumbnail">
				{postThumbnail &&
					<PostAttachment
						useSmallestThumbnail
						attachment={postThumbnail}
						spoilerLabel={getMessages(locale).post && getMessages(locale).post.spoiler}
						onClick={postThumbnailOnClick}
						fixAttachmentPictureSize={shouldFixAttachmentPictureSize}/>
				}
			</div>
			{postElement}
		</div>
	)
}

Comment.propTypes = {
	mode: PropTypes.oneOf(['board', 'thread']),
	comment: post.isRequired,
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

// Memoization won't work for "rest" and "default" arguments.
const getPostThumbnailMemoized = memoize(getPostThumbnail)