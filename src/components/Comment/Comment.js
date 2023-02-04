import React, { useState, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import PostTitle from 'social-components-react/components/PostTitle.js'
import PostContent from 'social-components-react/components/PostContent.js'
import PostAttachments from 'social-components-react/components/PostAttachments.js'
import PostStretchVertically from 'social-components-react/components/PostStretchVertically.js'
import { isMiddleDialogueChainLink } from 'social-components-react/components/CommentTree.js'

import CommentAuthor from './CommentAuthor.js'
import CommentStatusBadges from './CommentStatusBadges.js'
import CommentHidden from './CommentHidden.js'
import CommentFooter from './CommentFooter.js'
import WithTextSelectionActions from './WithTextSelectionActions.js'

import {
	comment as commentType,
	threadId,
	channelId
} from '../../PropTypes.js'

import useVote from './useVote.js'
import useSocial from './useSocial.js'
import usePostLink from './usePostLink.js'
import useAttachmentThumbnailFlags from './useAttachmentThumbnailFlags.js'

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

export default function Comment({
	as: Component,
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
	dispatch,
	locale,
	screenWidth,
	expandAttachments,
	onAttachmentClick,
	onHide,
	onReply,
	urlBasePath,
	postDateLinkClickable,
	postDateLinkUpdatePageUrlToPostUrlOnClick,
	postDateLinkNavigateToPostUrlOnClick,
	onDownloadThread,
	onRenderedContentDidChange,
	onPostUrlClick,
	moreActionsButtonRef,
	className,
	commentClassName,
	// <CommentTitleContentAndAttachments/> props:
	...rest
}) {
	const isFirstCommentInThread = comment.id === threadId
	const url = getUrl(channelId, threadId, comment.id)

	const [
		vote,
		onVote
	] = useVote({
		channelId,
		threadId,
		comment,
		locale
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

	// Get attachment thumbnail flags.
	const {
		showOnlyFirstAttachmentThumbnail,
		shouldFixAttachmentPictureSize,
		showPostThumbnailWhenThereAreMultipleAttachments,
		showPostThumbnailWhenThereIsNoContent
	} = useAttachmentThumbnailFlags({
		mode,
		comment,
		threadId
	})

	const [
		isSocialClickable,
		onSocialClick
	] = useSocial()

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
			onRenderedContentDidChange={onRenderedContentDidChange}
		/>
	)

	if (onReply) {
		titleContentAndAttachments = (
			<WithTextSelectionActions
				onReply={onReply}
				messages={getMessages(locale).post}>
				{titleContentAndAttachments}
			</WithTextSelectionActions>
		)
	}

	return (
		<Component className="Comment-exceptThumbnail">
			<CommentAuthor
				compact
				post={comment}
				locale={locale}
			/>
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
				onPostUrlClick={postDateLinkClickable ? onPostUrlClick : undefined}
				postDateLinkUpdatePageUrlToPostUrlOnClick={postDateLinkUpdatePageUrlToPostUrlOnClick}
				postDateLinkNavigateToPostUrlOnClick={postDateLinkNavigateToPostUrlOnClick}
				mode={mode}
				onReply={onReply}
				onHide={onHide}
				vote={vote}
				onVote={hasVoting ? onVote : undefined}
				hasVotes={hasVoting}
				onDownloadThread={onDownloadThread}
				moreActionsButtonRef={moreActionsButtonRef}
			/>
		</Component>
	)
}

Comment.propTypes = {
	as: PropTypes.elementType.isRequired,
	mode: PropTypes.oneOf(['channel', 'thread']).isRequired,
	comment: commentType.isRequired,
	threadId: threadId.isRequired,
	channelId: channelId.isRequired,
	channelIsNotSafeForWork: PropTypes.bool,
	hasVoting: PropTypes.bool,
	expandAttachments: PropTypes.bool,
	onAttachmentClick: PropTypes.func.isRequired,
	onHide: PropTypes.func.isRequired,
	locale: PropTypes.string.isRequired,
	parentComment: commentType,
	onDownloadThread: PropTypes.func,
	showingReplies: PropTypes.bool,
	onToggleShowReplies: PropTypes.func,
	toggleShowRepliesButtonRef: PropTypes.any,
	onRequestShowCommentFromSameThread: PropTypes.func,
	urlBasePath: PropTypes.string.isRequired,
	postDateLinkClickable: PropTypes.bool,
	postDateLinkUpdatePageUrlToPostUrlOnClick: PropTypes.bool,
	postDateLinkNavigateToPostUrlOnClick: PropTypes.bool,
	onHide: PropTypes.func.isRequired,
	onReply: PropTypes.func,
	dispatch: PropTypes.func,
	onRenderedContentDidChange: PropTypes.func,
	onPostUrlClick: PropTypes.func.isRequired,
	moreActionsButtonRef: PropTypes.object,
	className: PropTypes.string
}

Comment.defaultProps = {
	as: 'div',
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
	// (not used anywhere)
	// `4chan.org` displays attachment thumbnails as `125px`
	// (half the size) when they're not "OP posts".
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
	onAttachmentsDidChange,
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

		// If `lynxchan` imageboard client is used and
		// attachments' thumbnail sizes have been fixed
		// then re-render the comment thumbnail which is
		// rendered outside of `<PostContent/>`.
		if (comment.attachments) {
			for (const attachment of comment.attachments) {
				if (attachment.isLynxChanCatalogAttachmentsBug) {
					if (onAttachmentsDidChange) {
						onAttachmentsDidChange()
					}
					break
				}
			}
		}
	}, [
		// `comment.content` isn't supposed to change.
		// `comment` reference itself might change, but currently that
		// only happens as a symbolic `comment = { ...comment }` refresh
		// in `mergePrevAndNewThreadComments.js`, so the `comment` property
		// isn't added to the dependencies.
		comment.content,
		getCommentById,
		renderComments,
		onAttachmentsDidChange
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
	renderComments: PropTypes.func,
	onRenderedContentDidChange: PropTypes.func,
	showOnlyFirstAttachmentThumbnail: PropTypes.bool,
	onAttachmentsDidChange: PropTypes.func
}