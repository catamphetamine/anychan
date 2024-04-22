import React, { useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'

import PostTitle from 'social-components-react/components/PostTitle.js'
import PostContent from 'social-components-react/components/PostContent.js'
import PostAttachments from 'social-components-react/components/PostAttachments.js'
import PostStretchVertically from 'social-components-react/components/PostStretchVertically.js'
import { isMiddleDialogueChainLink } from 'social-components-react/components/CommentTree.js'

import useEffectSkipMount from 'frontend-lib/hooks/useEffectSkipMount.js'

import CommentAuthor from './CommentAuthor.js'
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

import { getResourceMessages, onCommentContentChange } from '../../utility/loadResourceLinks.js'
import getCommentLengthLimit from '../../utility/comment/getCommentLengthLimit.js'
import getUrl from '../../utility/getUrl.js'
import resourceCache from '../../utility/resourceCache.js'
import setEmbeddedAttachmentsProps from '../../utility/post/setEmbeddedAttachmentsProps.js'
import getConfiguration from '../../configuration.js'

import useChannelLayout from '../../pages/Channel/useChannelLayout.js'

import { areCookiesAccepted } from 'frontend-lib/utility/cookiePolicy.js'

import ArhivachIcon from '../../../assets/images/icons/services/arhivach.svg'
import TwoChannelIcon from '../../../dataSources/imageboards/2ch/logo.svg'
import FourChannelIcon from '../../../dataSources/imageboards/4chan/logo.svg'

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
	locale,
	messages,
	screenWidth,
	expandAttachments,
	onAttachmentClick,
	onHide,
	onReply,
	onReport,
	isOwn,
	setOwn,
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
	// <CommentTitleAndContentAndAttachments/> props:
	...rest
}) {
	// const isFirstCommentInThread = comment.id === threadId

	const url = getUrl(channelId, threadId, comment.id)

	const [
		vote,
		onVote
	] = useVote({
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

	const channelLayout = useChannelLayout()

	let titleContentAndAttachments = (
		<CommentTitleAndContentAndAttachments
			{...rest}
			comment={comment}
			expandAttachments={expandAttachments}
			onReply={onReply}
			locale={locale}
			messages={messages}
			resourceMessages={getResourceMessages(messages)}
			useSmallestThumbnailsForAttachments
			serviceIcons={SERVICE_ICONS}
			youTubeApiKey={getConfiguration().youtubeApiKey}
			expandFirstPictureOrVideo={false}
			maxAttachmentThumbnails={false}
			contentMaxLength={getCommentLengthLimit({ mode, channelLayout })}
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

	return (
		<Component className="Comment-exceptThumbnail">
			<CommentAuthor
				compact
				post={comment}
				messages={messages}
			/>
			<div className={commentClassName}>
				<div className="Comment-titleAndContentAndAttachments">
					{titleContentAndAttachments}
				</div>
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
				messages={messages}
				url={url}
				urlBasePath={urlBasePath}
				onPostUrlClick={postDateLinkClickable ? onPostUrlClick : undefined}
				postDateLinkUpdatePageUrlToPostUrlOnClick={postDateLinkUpdatePageUrlToPostUrlOnClick}
				postDateLinkNavigateToPostUrlOnClick={postDateLinkNavigateToPostUrlOnClick}
				mode={mode}
				onReply={onReply}
				onReport={onReport}
				isOwn={isOwn}
				setOwn={setOwn}
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
	messages: PropTypes.object.isRequired,
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
	onReport: PropTypes.func,
	isOwn: PropTypes.bool,
	setOwn: PropTypes.func,
	onRenderedContentDidChange: PropTypes.func,
	onPostUrlClick: PropTypes.func,
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

function CommentTitleAndContentAndAttachments({
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
	reRenderAttachments,
	url,
	locale,
	messages,
	onReply,
	showPostThumbnailWhenThereAreMultipleAttachments,
	showPostThumbnailWhenThereIsNoContent,
	showOnlyFirstAttachmentThumbnail,
	maxAttachmentThumbnails
}) {
	// `onPostContentChange()` function's "reference" shouldn't change between re-renders
	// and should stay the same. The reason is that it's used in a callback of `loadResourceLinks()`
	// function when `onPostContentChange` gets passed to `<PostContent/>`.
	const onPostContentChange = useCallback((comment) => {
		// If comment content changed as a result of loading
		// "resource" links (like a YouTube video link)
		// into standalone attachments (like a YouTube video player),
		// then check that those attachment's properties are "correct".
		// For example, it may prefer to align such attachments to the left, etc.
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
		// The re-rendering of the comment thumbnail
		// should be done because it now has the correct
		// `width` and `height` properties of the picture.
		if (comment.attachments) {
			for (const attachment of comment.attachments) {
				if (attachment.isLynxChanCatalogAttachmentsBug) {
					if (reRenderAttachments) {
						reRenderAttachments()
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
		reRenderAttachments
	])

	// `onPostContentChange()` function's "reference" shouldn't change between re-renders
	// and should stay the same. The reason is that it's used in a callback of `loadResourceLinks()`
	// function when `onPostContentChange` gets passed to `<PostContent/>`.
	useEffectSkipMount(() => {
		// `onPostContentChange()` reference does change in development on "hot-reload",
		// so only show the warning in production.
		if (process.env.NODE_ENV === 'production') {
			console.warn('`onPostContentChange()` function reference seems to have changed. It isn\'t supposed to change.')
		}
	}, [onPostContentChange])

	const withTextSelectionActionsProps = useMemo(() => ({
		onReply,
		messages
	}), [
		onReply,
		messages
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
				wrapperComponent={onReply && WithTextSelectionActions}
				wrapperComponentProps={onReply && withTextSelectionActionsProps}
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
				messages={messages.post}
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
				spoilerLabel={messages.post.spoiler}
				onAttachmentClick={onAttachmentClick}
			/>
			<PostStretchVertically/>
		</React.Fragment>
	)
}

CommentTitleAndContentAndAttachments.propTypes = {
	renderComments: PropTypes.func,
	onRenderedContentDidChange: PropTypes.func,
	showOnlyFirstAttachmentThumbnail: PropTypes.bool,
	reRenderAttachments: PropTypes.func,
	onReply: PropTypes.func
}