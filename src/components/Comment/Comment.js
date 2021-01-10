import React, { useState, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import PostTitle from 'webapp-frontend/src/components/PostTitle'
import PostContent from 'webapp-frontend/src/components/PostContent'
import PostAttachments from 'webapp-frontend/src/components/PostAttachments'
import PostStretchVertically from 'webapp-frontend/src/components/PostStretchVertically'

import TextSelectionTooltip from 'webapp-frontend/src/components/TextSelectionTooltip'
import Button from 'webapp-frontend/src/components/Button'

import CommentAuthor, { hasAuthor } from './CommentAuthor'
import CommentStatusBadges from './CommentStatusBadges'
import CommentHidden from './CommentHidden'
import CommentFooter from './CommentFooter'
import CommentWithThumbnail from './CommentWithThumbnail'

import {
	comment as commentType,
	threadId,
	channelId
} from '../../PropTypes'

import useVote from './useVote'
import useSlideshow from './useSlideshow'
import useSocial from './useSocial'
import usePostLink from './usePostLink'

import getMessages from '../../messages'
import { getResourceMessages, onCommentContentChange } from '../../utility/loadResourceLinks'
import getCommentLengthLimit from '../../utility/getCommentLengthLimit'
import getUrl from '../../utility/getUrl'
import setEmbeddedAttachmentsProps from '../../utility/setEmbeddedAttachmentsProps'
import configuration from '../../configuration'

import { isMiddleDialogueChainLink } from 'webapp-frontend/src/components/CommentTree'

import ArhivachIcon from '../../../assets/images/icons/services/arhivach.svg'
import TwoChannelIcon from '../../../providers/imageboards/2ch/logo.svg'
import FourChannelIcon from '../../../providers/imageboards/4chan/logo.svg'

import './Comment.css'

window.SHOW_POST_HEADER = false
// window.POST_FULL_WIDTH = true

export default function Comment({
	mode,
	comment,
	threadId,
	channelId,
	channelIsNotSafeForWork,
	hasVoting,
	showingReplies,
	onToggleShowReplies,
	toggleShowRepliesButtonRef,
	onShowComment,
	parentComment,
	elementRef,
	dispatch,
	locale,
	compact,
	screenWidth,
	expandAttachments,
	messages,
	onReply,
	onPostUrlClick,
	urlBasePath,
	isPreviouslyRead,
	onDownloadThread,
	className,
	// <OnLongPress/> stuff:
	onTouchStart,
	onTouchEnd,
	onTouchMove,
	onTouchCancel,
	onDragStart,
	onMouseDown,
	onMouseUp,
	onMouseMove,
	onMouseLeave,
	// "Reply on double click" stuff:
	onDoubleClick,
	// <CommentTitleContentAndAttachments/> props:
	...rest
}) {
	const isFirstCommentInThread = comment.id === threadId
	const url = getUrl(channelId, threadId, comment.id)
	if (compact === undefined) {
		compact = mode === 'thread' && !isFirstCommentInThread
	}

	const [
		vote,
		onVote
	] = useVote({
		channelId,
		threadId,
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
		channelId,
		threadId,
		comment,
		onShowComment
	})

	const [onAttachmentClick] = useSlideshow({ comment })

	const [
		isSocialClickable,
		onSocialClick
	] = useSocial(mode)

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

	const shouldFixAttachmentPictureSize = mode === 'channel' &&
		comment.attachments &&
		comment.attachments.length === 1 &&
		comment.attachments[0].isLynxChanCatalogAttachmentsBug
	const showPostThumbnailWhenThereAreMultipleAttachments = mode === 'channel' ||
		(mode === 'thread' && isFirstCommentInThread)
	const showPostThumbnailWhenThereIsNoContent = mode === 'channel'

	const commentClassName = 'Comment-comment'

	let commentElement
	if (hidden) {
		commentElement = (
			<CommentHidden
				comment={comment}
				locale={locale}
				onShow={toggleShowHide}
				className={commentClassName}/>
		)
	} else {
		let titleContentAndAttachments = (
			<CommentTitleContentAndAttachments
				{...rest}
				comment={comment}
				expandAttachments={expandAttachments}
				onlyShowFirstAttachmentThumbnail={mode === 'channel'}
				locale={locale}
				onReply={onReply}
				messages={getMessages(locale).post}
				resourceMessages={getResourceMessages(getMessages(locale))}
				useSmallestThumbnailsForAttachments
				serviceIcons={SERVICE_ICONS}
				youTubeApiKey={configuration.youtubeApiKey}
				expandFirstPictureOrVideo={false}
				maxAttachmentThumbnails={false}
				contentMaxLength={getCommentLengthLimit(mode)}
				onAttachmentClick={onAttachmentClick}
				onPostLinkClick={onPostLinkClick}
				isPostLinkClickable={isPostLinkClickable}
				isSocialClickable={isSocialClickable}
				onSocialClick={onSocialClick}
				url={url}
				fixAttachmentPictureSizes={shouldFixAttachmentPictureSize}
				showPostThumbnailWhenThereAreMultipleAttachments={showPostThumbnailWhenThereAreMultipleAttachments}
				showPostThumbnailWhenThereIsNoContent={showPostThumbnailWhenThereIsNoContent}/>
		)
		if (onReply) {
			titleContentAndAttachments = (
				<WithTextSelectionTooltip
					onReply={onReply}
					messages={getMessages(locale).post}>
					{titleContentAndAttachments}
				</WithTextSelectionTooltip>
			)
		}
		commentElement = (
			<div className="Comment-exceptThumbnail">
				<CommentAuthor
					post={comment}
					locale={locale}/>
				<div className={commentClassName}>
					{titleContentAndAttachments}
				</div>
				<CommentFooter
					comment={comment}
					threadId={threadId}
					channelId={channelId}
					channelIsNotSafeForWork={channelIsNotSafeForWork}
					parentComment={parentComment}
					showingReplies={showingReplies}
					onToggleShowReplies={shouldShowRepliesButton(comment, parentComment) ? onToggleShowReplies : undefined}
					toggleShowRepliesButtonRef={toggleShowRepliesButtonRef}
					locale={locale}
					dispatch={dispatch}
					url={url}
					urlBasePath={urlBasePath}
					onPostUrlClick={_onPostUrlClick}
					mode={mode}
					onReply={onReply}
					vote={vote}
					onDownloadThread={onDownloadThread}/>
			</div>
		)
	}
	// `elementRef` is supplied by `<CommentTree/>`
	// and is used to to scroll to the parent post
	// when the user hides its replies tree.
	return (
		<CommentWithThumbnail
			ref={elementRef}
			onTouchStart={onTouchStart}
			onTouchEnd={onTouchEnd}
			onTouchMove={onTouchMove}
			onTouchCancel={onTouchCancel}
			onDragStart={onDragStart}
			onMouseDown={onMouseDown}
			onMouseUp={onMouseUp}
			onMouseMove={onMouseMove}
			onMouseLeave={onMouseLeave}
			onDoubleClick={onDoubleClick}
			mode={mode}
			comment={comment}
			hidden={hidden}
			locale={locale}
			onReply={onReply}
			expandAttachments={expandAttachments}
			onAttachmentClick={onAttachmentClick}
			shouldFixAttachmentPictureSize={shouldFixAttachmentPictureSize}
			showPostThumbnailWhenThereAreMultipleAttachments={showPostThumbnailWhenThereAreMultipleAttachments}
			showPostThumbnailWhenThereIsNoContent={showPostThumbnailWhenThereIsNoContent}
			className={classNames(className, 'Comment', `Comment--${mode}`, {
				'Comment--compact': compact,
				'Comment--hidden': hidden,
				// 'Comment--removed': comment.removed,
				'Comment--titled': comment.title,
				'Comment--authored': hasAuthor(comment),
				'Comment--opening': mode === 'thread' && comment.id === threadId,
				'Comment--showHeader': window.SHOW_POST_HEADER,
				'Comment--fullWidth': window.POST_FULL_WIDTH,
				'Comment--previouslyRead': isPreviouslyRead ? !showingReplies && !parentComment && !clickedPostUrl && isPreviouslyRead(comment.id) : undefined
			})}>
			{commentElement}
		</CommentWithThumbnail>
	)
}

Comment.propTypes = {
	compact: PropTypes.bool,
	mode: PropTypes.oneOf(['channel', 'thread']).isRequired,
	comment: commentType.isRequired,
	threadId: threadId.isRequired,
	channelId: channelId.isRequired,
	channelIsNotSafeForWork: PropTypes.bool,
	hasVoting: PropTypes.bool,
	expandAttachments: PropTypes.bool,
	locale: PropTypes.string.isRequired,
	parentComment: commentType,
	isPreviouslyRead: PropTypes.func,
	onDownloadThread: PropTypes.func,
	showingReplies: PropTypes.bool,
	onToggleShowReplies: PropTypes.func,
	toggleShowRepliesButtonRef: PropTypes.any,
	// `elementRef` is supplied by `<CommentTree/>`
	// and is used to to scroll to the parent post
	// when the user hides its replies tree.
	elementRef: PropTypes.any,
	onPostUrlClick: PropTypes.func,
	onShowComment: PropTypes.func.isRequired,
	urlBasePath: PropTypes.string.isRequired,
	onReply: PropTypes.func,
	messages: PropTypes.object.isRequired,
	dispatch: PropTypes.func,
	className: PropTypes.string
}

const SERVICE_ICONS = {
	'arhivach': ArhivachIcon,
	'2ch': TwoChannelIcon,
	'4chan': FourChannelIcon
}

function shouldShowRepliesButton(comment, parentComment) {
	if (comment.replies) {
		// Don't show the "show/hide replies" button for "one-on-one" dialogue comments
		// that are part of an already expanded replies tree of their parent comment.
		// This means that the "show/hide replies" button will still be visible
		// for "one-on-one" dialogue comments when they're shown at the root level
		// rather than as part of an expanded replies tree of their parent comment.
		if (!isBeingShownAsPartOfAnExpandedRepliesTreeOfTheParentComment(comment, parentComment)) {
			return true
		}
	}
}

function isBeingShownAsPartOfAnExpandedRepliesTreeOfTheParentComment(comment, parentComment) {
	return parentComment && isMiddleDialogueChainLink(comment, parentComment)
}

function WithTextSelectionTooltip({
	onReply,
	messages,
	children
}) {
	const tooltipProps = useMemo(() => ({
		onReply,
		children: messages.reply
	}), [
		onReply,
		messages
	])
	return (
		<TextSelectionTooltip
			TooltipComponent={TextSelectionTooltipComponent}
			tooltipProps={tooltipProps}>
			{children}
		</TextSelectionTooltip>
	)
}

WithTextSelectionTooltip.propTypes = {
	onReply: PropTypes.func.isRequired,
	messages: PropTypes.object.isRequired,
	children: PropTypes.node.isRequired
}

function CommentTitleContentAndAttachments({
	comment,
	initialExpandContent,
	onExpandContent,
	initialExpandPostLinkQuotes,
	onRenderedContentDidChange,
	youTubeApiKey,
	renderComment,
	getCommentById,
	contentMaxLength,
	resourceMessages,
	fixAttachmentPictureSizes,
	expandFirstPictureOrVideo,
	expandAttachments,
	attachmentThumbnailSize,
	useSmallestThumbnailsForAttachments,
	serviceIcons,
	onAttachmentClick,
	onPostLinkClick,
	isPostLinkClickable,
	isSocialClickable,
	onSocialClick,
	expandPostLinkBlockQuotes,
	postLinkQuoteMinimizedComponent,
	postLinkQuoteExpandTimeout,
	onPostLinkQuoteExpand,
	url,
	locale,
	messages,
	onReply,
	showPostThumbnailWhenThereAreMultipleAttachments,
	showPostThumbnailWhenThereIsNoContent,
	maxAttachmentThumbnails,
	onlyShowFirstAttachmentThumbnail
}) {
	const onPostContentChange = useCallback((comment) => {
		// If comment content changed as a result of loading
		// "resource" links (like a YouTube video link)
		// into standalone attachments (like a YouTube video player),
		// then check that those attachment's properties are "correct".
		// For example, it may align attachments to the left, etc.
		setEmbeddedAttachmentsProps(comment)
		// Update autogenerated quotes in replies to this comment.
		onCommentContentChange(comment, {
			getCommentById,
			renderComment
		})
	}, [
		// `comment.content` isn't supposed to change.
		// `comment` reference itself might change, but currently that
		// only happens as a symbolic `comment = { ...comment }` refresh
		// in `mergePrevAndNewThreadComments.js`, so the `comment` property
		// isn't added to the dependencies.
		comment.content,
		getCommentById,
		renderComment
	])
	return (
		<React.Fragment>
			<PostTitle
				compact
				post={comment}/>
			<PostContent
				compact
				post={comment}
				initialExpandContent={initialExpandContent}
				onExpandContent={onExpandContent}
				initialExpandPostLinkQuotes={initialExpandPostLinkQuotes}
				onRenderedContentDidChange={onRenderedContentDidChange}
				onPostContentChange={onPostContentChange}
				youTubeApiKey={youTubeApiKey}
				contentMaxLength={contentMaxLength}
				resourceMessages={resourceMessages}
				fixAttachmentPictureSizes={fixAttachmentPictureSizes}
				expandFirstPictureOrVideo={expandFirstPictureOrVideo}
				expandAttachments={expandAttachments}
				attachmentThumbnailSize={attachmentThumbnailSize}
				useSmallestThumbnailsForAttachments={useSmallestThumbnailsForAttachments}
				serviceIcons={serviceIcons}
				onAttachmentClick={onAttachmentClick}
				onPostLinkClick={onPostLinkClick}
				isPostLinkClickable={isPostLinkClickable}
				isSocialClickable={isSocialClickable}
				onSocialClick={onSocialClick}
				expandPostLinkBlockQuotes={expandPostLinkBlockQuotes}
				postLinkQuoteMinimizedComponent={postLinkQuoteMinimizedComponent}
				postLinkQuoteExpandTimeout={postLinkQuoteExpandTimeout}
				onPostLinkQuoteExpand={onPostLinkQuoteExpand}
				url={url}
				locale={locale}
				messages={messages}/>
			<PostAttachments
				compact
				post={comment}
				showPostThumbnailWhenThereAreMultipleAttachments={showPostThumbnailWhenThereAreMultipleAttachments}
				showPostThumbnailWhenThereIsNoContent={showPostThumbnailWhenThereIsNoContent}
				expandFirstPictureOrVideo={expandFirstPictureOrVideo}
				useSmallestThumbnails={useSmallestThumbnailsForAttachments}
				maxAttachmentThumbnails={maxAttachmentThumbnails}
				attachmentThumbnailSize={attachmentThumbnailSize}
				expandAttachments={expandAttachments}
				onlyShowFirstAttachmentThumbnail={onlyShowFirstAttachmentThumbnail}
				spoilerLabel={messages.spoiler}
				onAttachmentClick={onAttachmentClick}/>
			<PostStretchVertically/>
		</React.Fragment>
	)
}

function TextSelectionTooltipComponent({
	selection,
	onReply,
	children,
	...rest
}, ref) {
	const onClick = () => {
		onReply(selection.getText())
		selection.clear()
	}
	return (
		<Button
			ref={ref}
			{...rest}
			type="button"
			onClick={onClick}
			className="Comment-textSelectionTooltip">
			{children}
		</Button>
	)
}

TextSelectionTooltipComponent = React.forwardRef(TextSelectionTooltipComponent)

TextSelectionTooltipComponent.propTypes = {
	selection: PropTypes.object.isRequired,
	onReply: PropTypes.func.isRequired
}