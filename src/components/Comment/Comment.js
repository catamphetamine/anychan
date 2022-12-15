import React, { useState, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import PostTitle from 'social-components-react/components/PostTitle.js'
import PostContent from 'social-components-react/components/PostContent.js'
import PostAttachments from 'social-components-react/components/PostAttachments.js'
import PostStretchVertically from 'social-components-react/components/PostStretchVertically.js'
import { isMiddleDialogueChainLink } from 'social-components-react/components/CommentTree.js'

import TextSelectionTooltip from 'frontend-lib/components/TextSelectionTooltip.js'
import Button from 'frontend-lib/components/Button.js'

import CommentAuthor, { hasAuthor } from './CommentAuthor.js'
import CommentStatusBadges from './CommentStatusBadges.js'
import CommentHidden from './CommentHidden.js'
import CommentFooter from './CommentFooter.js'
import CommentWithThumbnail from './CommentWithThumbnail.js'

import {
	comment as commentType,
	threadId,
	channelId
} from '../../PropTypes.js'

import useVote from './useVote.js'
import useSlideshow from './useSlideshow.js'
import useSocial from './useSocial.js'
import usePostLink from './usePostLink.js'
import useHide from './useHide.js'

import getMessages from '../../messages/index.js'
import { getResourceMessages, onCommentContentChange } from '../../utility/loadResourceLinks.js'
import getCommentLengthLimit from '../../utility/comment/getCommentLengthLimit.js'
import getUrl from '../../utility/getUrl.js'
import resourceCache from '../../utility/resourceCache.js'
import setEmbeddedAttachmentsProps from '../../utility/post/setEmbeddedAttachmentsProps.js'
import configuration from '../../configuration.js'

import { areCookiesAccepted } from 'frontend-lib/utility/cookiePolicy.js'

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
	showRepliesCount,
	onToggleShowReplies,
	toggleShowRepliesButtonRef,
	onRequestShowCommentFromSameThread,
	parentComment,
	elementRef,
	dispatch,
	locale,
	compact,
	screenWidth,
	expandAttachments,
	onReply,
	onPostUrlClick,
	urlBasePath,
	postDateLinkClickable,
	postDateLinkUpdatePageUrlToPostUrlOnClick,
	postDateLinkNavigateToPostUrlOnClick,
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

	// Set default `compact` property value of `<Post/>` element.
	if (compact === undefined) {
		if (mode === 'thread') {
			compact = !isFirstCommentInThread
		} else if (mode === 'channel') {
			// "Main" comment.
			if (isFirstCommentInThread) {
				compact = false
			}
			// "Latest" comments.
			else {
				compact = true
			}
		}
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

	const {
		hidden,
		onHide,
		onUnHide
	} = useHide({
		channelId,
		threadId,
		comment
	})

	const [
		onPostLinkClick,
		isPostLinkClickable
	] = usePostLink({
		channelId,
		threadId,
		comment,
		onRequestShowCommentFromSameThread
	})

	const [onAttachmentClick] = useSlideshow({ comment })

	const [
		isSocialClickable,
		onSocialClick
	] = useSocial()

	const [clickedPostUrl, setClickedPostUrl] = useState()

	// When rendering `<Post/>` component, it automatically passes a second argument
	// called `post` to `onPostUrlClick()` function of `<PostDate/>` → `<PostSelfLink/>`.
	// But this application doesn't render the `<Post/>` component directly.
	// Instead, it manually renders a `<PostSelfLink/>` element in `<CommentFooter/>`.
	// Therefore, it should manually pass the second argument called `comment`
	// to `onPostUrlClick()` function, which it does here.
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
		isFirstCommentInThread &&
		comment.attachments &&
		comment.attachments.length === 1 &&
		comment.attachments[0].isLynxChanCatalogAttachmentsBug

	// `showPostThumbnailWhenThereAreMultipleAttachments` — Pass `true` to allow returning
	// post thumbnail in cases when the `post` has multiple thumbnail-able attachments.
	// By default, if the `post` has multiple thumbnail-able attachments, none of them will be returned.
	const showPostThumbnailWhenThereAreMultipleAttachments =
		(mode === 'channel' && isFirstCommentInThread) ||
		(mode === 'thread' && isFirstCommentInThread)

	// `showPostThumbnailWhenThereIsNoContent` — Pass `true` to allow returning post thumbnail
	// in cases when the `post` has no `content`. By default, if the `post` has no `content`,
	// no post thumbnail will be shown, and the post would be rendered with all of its attachments
	// inside it's content part, without promoting the first one to a "post thumbnail".
	const showPostThumbnailWhenThereIsNoContent = mode === 'channel' && isFirstCommentInThread

	const showOnlyFirstAttachmentThumbnail = mode === 'channel' && isFirstCommentInThread

	const commentClassName = 'Comment-comment'

	let commentElement
	if (hidden) {
		commentElement = (
			<CommentHidden
				comment={comment}
				locale={locale}
				onShow={onUnHide}
				className={commentClassName}
			/>
		)
	} else {
		let titleContentAndAttachments = (
			<CommentTitleContentAndAttachments
				{...rest}
				comment={comment}
				expandAttachments={expandAttachments}
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
				showOnlyFirstAttachmentThumbnail={showOnlyFirstAttachmentThumbnail}
				showPostThumbnailWhenThereAreMultipleAttachments={showPostThumbnailWhenThereAreMultipleAttachments}
				showPostThumbnailWhenThereIsNoContent={showPostThumbnailWhenThereIsNoContent}
			/>
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
					compact
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
					showRepliesCount={showRepliesCount && shouldShowRepliesButton(comment, parentComment)}
					onToggleShowReplies={onToggleShowReplies}
					toggleShowRepliesButtonRef={toggleShowRepliesButtonRef}
					locale={locale}
					dispatch={dispatch}
					url={url}
					urlBasePath={urlBasePath}
					onPostUrlClick={postDateLinkClickable ? _onPostUrlClick : undefined}
					postDateLinkUpdatePageUrlToPostUrlOnClick={postDateLinkUpdatePageUrlToPostUrlOnClick}
					postDateLinkNavigateToPostUrlOnClick={postDateLinkNavigateToPostUrlOnClick}
					mode={mode}
					onReply={onReply}
					onHide={onHide}
					vote={vote}
					onVote={hasVoting ? onVote : undefined}
					hasVotes={hasVoting}
					onDownloadThread={onDownloadThread}
				/>
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
	onRequestShowCommentFromSameThread: PropTypes.func,
	urlBasePath: PropTypes.string.isRequired,
	postDateLinkClickable: PropTypes.bool,
	postDateLinkUpdatePageUrlToPostUrlOnClick: PropTypes.bool,
	postDateLinkNavigateToPostUrlOnClick: PropTypes.bool,
	onReply: PropTypes.func,
	dispatch: PropTypes.func,
	className: PropTypes.string
}

Comment.defaultProps = {
	postDateLinkClickable: true
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
	onExpandContentChange,
	initialExpandPostLinkQuotes,
	onRenderedContentDidChange,
	youTubeApiKey,
	renderComments,
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
	expandGeneratedPostLinkBlockQuotes,
	postLinkQuoteMinimizedComponent,
	postLinkQuoteExpandTimeout,
	onPostLinkQuoteExpanded,
	url,
	locale,
	messages,
	onReply,
	showPostThumbnailWhenThereAreMultipleAttachments,
	showPostThumbnailWhenThereIsNoContent,
	showOnlyFirstAttachmentThumbnail,
	maxAttachmentThumbnails
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
			renderComments
		})
	}, [
		// `comment.content` isn't supposed to change.
		// `comment` reference itself might change, but currently that
		// only happens as a symbolic `comment = { ...comment }` refresh
		// in `mergePrevAndNewThreadComments.js`, so the `comment` property
		// isn't added to the dependencies.
		comment.content,
		getCommentById,
		renderComments
	])

	return (
		<React.Fragment>
			<PostTitle
				compact
				post={comment}
			/>
			<PostContent
				compact
				post={comment}
				initialExpandContent={initialExpandContent}
				onExpandContentChange={onExpandContentChange}
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
				expandGeneratedPostLinkBlockQuotes={expandGeneratedPostLinkBlockQuotes}
				postLinkQuoteMinimizedComponent={postLinkQuoteMinimizedComponent}
				postLinkQuoteExpandTimeout={postLinkQuoteExpandTimeout}
				onPostLinkQuoteExpanded={onPostLinkQuoteExpanded}
				resourceCache={areCookiesAccepted() ? resourceCache : undefined}
				url={url}
				locale={locale}
				messages={messages}
			/>
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
				showOnlyFirstAttachmentThumbnail={showOnlyFirstAttachmentThumbnail}
				spoilerLabel={messages.spoiler}
				onAttachmentClick={onAttachmentClick}
			/>
			<PostStretchVertically/>
		</React.Fragment>
	)
}

CommentTitleContentAndAttachments.propTypes = {
	renderComments: PropTypes.func
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