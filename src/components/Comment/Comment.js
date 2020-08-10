import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Post from 'webapp-frontend/src/components/Post'
import PostTitle from 'webapp-frontend/src/components/PostTitle'

import CommentAuthor, { hasAuthor } from './CommentAuthor'
import CommentStatusBadges from './CommentStatusBadges'
import CommentHidden from './CommentHidden'
import CommentFooter from './CommentFooter' // , { hasReplies }
import CommentWithThumbnail from './CommentWithThumbnail'

import useVote from './useVote'
import useSlideshow from './useSlideshow'
import usePostLink from './usePostLink'

import getMessages from '../../messages'
import { getChan } from '../../chan'
import { getResourceMessages } from '../../utility/loadResourceLinks'
import getCommentLengthLimit from '../../utility/getCommentLengthLimit'
import getUrl from '../../utility/getUrl'
import configuration from '../../configuration'

import { isMiddleDialogueChainLink } from 'webapp-frontend/src/components/CommentTree'

import ArhivachIcon from '../../../assets/images/icons/services/arhivach.svg'

import './Comment.css'

window.SHOW_POST_HEADER = false
// window.POST_FULL_WIDTH = true

export default function Comment({
	mode,
	comment,
	thread,
	board,
	showingReplies,
	onToggleShowReplies,
	toggleShowRepliesButtonRef,
	onShowComment,
	parentComment,
	postRef,
	dispatch,
	locale,
	compact,
	screenWidth,
	expandAttachments,
	onReply,
	onPostUrlClick,
	urlBasePath,
	previouslyRead,
	className,
	...rest
}) {
	const isFirstCommentInThread = comment.id === thread.id
	const url = getUrl(board, thread, comment)
	if (compact === undefined) {
		compact = mode === 'thread' && !isFirstCommentInThread
	}

	const [
		vote,
		onVote
	] = useVote({
		board,
		thread,
		comment,
		locale
	})

	const [hidden, setHidden] = useState(comment.hidden)
	const toggleShowHide = useCallback(
		() => setHidden(!hidden),
		[hidden]
	)

	const [
		onPostLinkClick,
		isPostLinkClickable
	] = usePostLink({
		board,
		thread,
		comment,
		onShowComment
	})

	const [onAttachmentClick] = useSlideshow({ comment })

	const [clickedPostUrl, setClickedPostUrl] = useState()
	// `<Post/>` automatically passes a second argument `post` here,
	// but because `<PostSelfLink/>` is used directly here,
	// it doesn't add that second `post` argument "under the hood",
	// so instead it's passed to `onPostUrlClick()` explicitly
	// from the `comment` property.
	const _onPostUrlClick = useCallback((event) => {
		if (onPostUrlClick) {
			onPostUrlClick(event, comment)
		}
		setClickedPostUrl(true)
	}, [
		comment,
		onPostUrlClick,
		setClickedPostUrl
	])

	const shouldFixAttachmentPictureSize = mode === 'board' &&
		comment.attachments &&
		comment.attachments.length === 1 &&
		comment.attachments[0].isLynxChanCatalogAttachmentsBug

	const onShowReplies = hasReplies(comment, parentComment) ? onToggleShowReplies : undefined

	const showPostThumbnailWhenThereAreMultipleAttachments = mode === 'board' ||
		(mode === 'thread' && isFirstCommentInThread)

	const commentClassName = 'Comment-comment'

	// `postRef` is supplied by `<CommentTree/>`
	// and is used to focus stuff on toggle reply form.
	const commentElement = hidden ? (
		<CommentHidden
			comment={comment}
			locale={locale}
			onShow={toggleShowHide}
			className={commentClassName}/>
	) : (
		<div className="Comment-exceptThumbnail">
			<CommentAuthor
				post={comment}
				locale={locale}/>
			<PostTitle post={comment}/>
			<Post
				{...rest}
				ref={postRef}
				post={comment}
				showHeader={false}
				expandAttachments={expandAttachments}
				onlyShowFirstAttachmentThumbnail={mode === 'board'}
				compact={compact}
				stretch
				header={CommentAuthor}
				locale={locale}
				messages={getMessages(locale).post}
				resourceMessages={getResourceMessages(getMessages(locale))}
				moreActions={undefined ? moreActions : undefined}
				showingReplies={showingReplies}
				onShowReplies={onShowReplies}
				toggleShowRepliesButtonRef={toggleShowRepliesButtonRef}
				headerBadges={CommentStatusBadges}
				useSmallestThumbnailsForAttachments
				serviceIcons={SERVICE_ICONS}
				youTubeApiKey={configuration.youtube && configuration.youtube.apiKey}
				expandFirstPictureOrVideo={false}
				maxAttachmentThumbnails={false}
				contentMaxLength={getCommentLengthLimit(mode)}
				onAttachmentClick={onAttachmentClick}
				onPostLinkClick={onPostLinkClick}
				isPostLinkClickable={isPostLinkClickable}
				onReply={onReply}
				url={url}
				urlBasePath={urlBasePath}
				vote={vote}
				onVote={onVote}
				onPostUrlClick={_onPostUrlClick}
				fixAttachmentPictureSizes={shouldFixAttachmentPictureSize}
				showPostThumbnailWhenThereAreMultipleAttachments={showPostThumbnailWhenThereAreMultipleAttachments}
				className={commentClassName}/>
			<CommentFooter
				comment={comment}
				thread={thread}
				board={board}
				parentComment={parentComment}
				showingReplies={showingReplies}
				onShowReplies={onShowReplies}
				onToggleShowReplies={onToggleShowReplies}
				toggleShowRepliesButtonRef={toggleShowRepliesButtonRef}
				locale={locale}
				dispatch={dispatch}
				url={url}
				urlBasePath={urlBasePath}
				onPostUrlClick={_onPostUrlClick}
				mode={mode}
				onReply={onReply}
				vote={vote}
				onVote={onVote}/>
		</div>
	)
	return (
		<CommentWithThumbnail
			mode={mode}
			comment={comment}
			thread={thread}
			hidden={hidden}
			locale={locale}
			onReply={onReply}
			expandAttachments={expandAttachments}
			onAttachmentClick={onAttachmentClick}
			shouldFixAttachmentPictureSize={shouldFixAttachmentPictureSize}
			showPostThumbnailWhenThereAreMultipleAttachments={showPostThumbnailWhenThereAreMultipleAttachments}
			className={classNames(className, 'Comment', `Comment--${mode}`, {
				'Comment--compact': compact,
				'Comment--hidden': hidden,
				'Comment--titled': comment.title,
				'Comment--authored': hasAuthor(comment),
				'Comment--opening': mode === 'thread' && comment.id === thread.id,
				'Comment--showHeader': window.SHOW_POST_HEADER,
				'Comment--fullWidth': window.POST_FULL_WIDTH,
				'Comment--last': thread.comments[thread.comments.length - 1].id === comment.id,
				'Comment--previouslyRead': previouslyRead ? !showingReplies && !parentComment && !clickedPostUrl && previouslyRead(comment.id) : undefined
			})}>
			{commentElement}
		</CommentWithThumbnail>
	)
}

Comment.propTypes = {
	compact: PropTypes.bool,
	mode: PropTypes.oneOf(['board', 'thread']).isRequired,
	comment: commentType.isRequired,
	thread: threadType.isRequired,
	board: boardType.isRequired,
	expandAttachments: PropTypes.bool,
	locale: PropTypes.string.isRequired,
	parentComment: commentType,
	previouslyRead: PropTypes.func,
	showingReplies: PropTypes.bool,
	onToggleShowReplies: PropTypes.func,
	toggleShowRepliesButtonRef: PropTypes.any,
	// `postRef` is supplied by `<CommentTree/>`
	// and is used to focus stuff on toggle reply form.
	postRef: PropTypes.any,
	onPostUrlClick: PropTypes.func,
	onShowComment: PropTypes.func.isRequired,
	urlBasePath: PropTypes.string.isRequired,
	onReply: PropTypes.func,
	dispatch: PropTypes.func,
	className: PropTypes.string
}

const SERVICE_ICONS = {
	'arhivach': ArhivachIcon,
	'2ch': getChan('2ch').logo,
	'4chan': getChan('4chan').logo
}

function hasReplies(comment, parentComment) {
	return comment.replies && !(parentComment && isMiddleDialogueChainLink(comment, parentComment))
}