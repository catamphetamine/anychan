import type { Comment, ChannelId, ThreadId, Messages, Locale, Mode } from '@/types'

import React, { ReactElement, ReactNode, RefObject, useMemo } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import {
	comment as commentType,
	threadId,
	channelId
} from '../../PropTypes.js'

import getCommentInfoIcons from './getCommentInfoIcons.js'
import getThreadInfoIcons from './getThreadInfoIcons.js'

import PostBadge from 'social-components-react/components/PostBadge.js'
import PostVotes from 'social-components-react/components/PostVotes.js'
import PressedStateButton from 'social-components-react/components/PressedStateButton.js'
import Padding from 'social-components-react/components/Padding.js'

import MessageIcon from 'frontend-lib/icons/message-rounded-rect-square-thicker.svg'
// import ReplyIcon from 'frontend-lib/icons/reply.svg'

import CommentMoreActions from './CommentMoreActions.js'
import CommentFooterDate from './CommentFooterDate.js'
import CommentFooterSeparator from './CommentFooterSeparator.js'

import { useDataSource, usePageStateSelector } from '@/hooks'

import './CommentFooter.css'
import './CommentFooterBadge.css'

export default function CommentFooter({
	comment,
	threadId,
	channelId,
	channelContainsExplicitContent,
	parentComment,
	postDateLinkUpdatePageUrlToPostUrlOnClick,
	postDateLinkNavigateToPostUrlOnClick,
	showingReplies,
	showRepliesCount = true,
	onToggleShowReplies,
	toggleShowRepliesButtonRef,
	onDownloadThread,
	locale,
	messages,
	url,
	urlBasePath,
	vote,
	onVote,
	onPostUrlClick,
	mode,
	onReply,
	onReport,
	isOwn,
	setOwn,
	onHide,
	moreActionsButtonRef
}: CommentFooterProps) {
	const dataSource = useDataSource()

	const subscribedThreadIds = usePageStateSelector('channelPage', state => state.channelPage.subscribedThreadIds)

	const isSubscribedThreadInCatalog = useMemo(() => {
		if (mode === 'channel') {
			return subscribedThreadIds.includes(threadId)
		}
	}, [
		subscribedThreadIds,
		channelId,
		threadId
	])

	const commentInfoIcons = useMemo(() => {
		let icons = getCommentInfoIcons({ dataSource, isOwnComment: isOwn })
		// This type of filtering is done in `<Post/>` automatically,
		// but since `leftSideBadges` are also used here outside `<Post/>`,
		// they're filtered here manually.
		icons = icons.filter(({ condition }) => condition(comment, { isSubscribedThreadInCatalog }))
		if (icons.length > 0) {
			return icons
		}
	}, [
		comment,
		dataSource,
		isSubscribedThreadInCatalog,
		isOwn,
		comment.isReplyToOwnComment
	])

	const threadInfoIcons = useMemo(() => {
		let icons = getThreadInfoIcons()
		// This type of filtering is done in `<Post/>` automatically,
		// but since `leftSideBadges` are also used here outside `<Post/>`,
		// they're filtered here manually.
		icons = icons.filter(({ condition }) => condition(comment, { isSubscribedThreadInCatalog }))
		if (icons.length > 0) {
			return icons
		}
	}, [
		comment,
		isSubscribedThreadInCatalog
		// parentComment,
		// showingReplies,
		// onToggleShowReplies,
		// toggleShowRepliesButtonRef
	])

	const postLinkProps = useMemo(() => ({
		url: url,
		baseUrl: urlBasePath,
		onClick: onPostUrlClick,
		updatePageUrlToPostUrlOnClick: postDateLinkUpdatePageUrlToPostUrlOnClick,
		navigateToPostUrlOnClick: postDateLinkNavigateToPostUrlOnClick
	}), [
		url,
		urlBasePath,
		onPostUrlClick,
		postDateLinkUpdatePageUrlToPostUrlOnClick,
		postDateLinkNavigateToPostUrlOnClick
	])

	const rightSideElementTypes: Array<keyof typeof RIGHT_SIDE_ELEMENT> = []
	if (onVote) {
		rightSideElementTypes.push('vote')
	}
	if (commentInfoIcons) {
		rightSideElementTypes.push('comment-info-icons')
	}
	if (comment.createdAt) {
		rightSideElementTypes.push('time')
	}
	if (showRepliesCount && comment.replies) {
		rightSideElementTypes.push('replies')
	}
	const timeElementIndex = rightSideElementTypes.indexOf('time')

	const rightSideElements: Array<{
		key: keyof typeof RIGHT_SIDE_ELEMENT,
		element: ReactElement
	}> = rightSideElementTypes.map((key: keyof typeof RIGHT_SIDE_ELEMENT) => ({
		key,
		element: RIGHT_SIDE_ELEMENT[key]({
			comment,
			vote,
			onVote,
			locale,
			messages,
			commentInfoIcons,
			showingReplies,
			showRepliesCount,
			onToggleShowReplies,
			toggleShowRepliesButtonRef,
			hasAnythingBeforeTime: timeElementIndex > 0,
			hasAnythingAfterTime: timeElementIndex >= 0 && timeElementIndex < rightSideElementTypes.length - 1,
			postLinkProps
		})
	}))

	return (
		<div className="CommentFooter">
			<div className="CommentFooter-left">
				{threadInfoIcons && threadInfoIcons.map((badge, i) => (
					<PostBadge
						key={badge.name}
						post={comment}
						parameters={{ locale, messages }}
						badge={badge}
						className={classNames('CommentFooterBadge', 'CommentFooterBadge--left', `CommentFooterBadge--${badge.name}`, {
							'CommentFooterBadge--last': i === threadInfoIcons.length - 1,
							'CommentFooterBadge--ignoreCursor': !badge.title
						})}
						iconClassName={`CommentFooterBadge-icon CommentFooterBadge-icon--${badge.name}`}
					/>
				))}
			</div>
			<div className="CommentFooter-right">
				<div className="CommentFooter-rightExceptMoreActions">
					{addSpacing(rightSideElements).map(({ key, element }) => {
						return React.cloneElement(element, { key })
					})}
				</div>
				<CommentMoreActions
					buttonRef={moreActionsButtonRef}
					comment={comment}
					threadId={threadId}
					channelId={channelId}
					channelContainsExplicitContent={channelContainsExplicitContent}
					messages={messages}
					mode={mode}
					url={url}
					urlBasePath={urlBasePath}
					onReply={onReply}
					onReport={onReport}
					isOwn={isOwn}
					setOwn={setOwn}
					onDownloadThread={onDownloadThread}
					onHide={onHide}
				/>
			</div>
		</div>
	)
}

CommentFooter.propTypes = {
	channelId: channelId.isRequired,
	channelContainsExplicitContent: PropTypes.bool,
	threadId: threadId.isRequired,
	comment: commentType.isRequired,
	parentComment: commentType,
	postDateLinkUpdatePageUrlToPostUrlOnClick: PropTypes.bool,
	postDateLinkNavigateToPostUrlOnClick: PropTypes.bool,
	showingReplies: PropTypes.bool,
	showRepliesCount: PropTypes.bool,
	onToggleShowReplies: PropTypes.func,
	toggleShowRepliesButtonRef: PropTypes.any,
	onPostUrlClick: PropTypes.func,
	locale: PropTypes.string.isRequired,
	messages: PropTypes.object.isRequired,
	mode: PropTypes.oneOf(['channel', 'thread']).isRequired,
	onReply: PropTypes.func,
	onReport: PropTypes.func,
	isOwn: PropTypes.bool,
	setOwn: PropTypes.func,
	onHide: PropTypes.func.isRequired,
	urlBasePath: PropTypes.string.isRequired,
	url: PropTypes.string.isRequired,
	vote: PropTypes.bool,
	onVote: PropTypes.func,
	onDownloadThread: PropTypes.func,
	moreActionsButtonRef: PropTypes.object
}

interface CommentFooterProps {
	comment: Comment,
	threadId: ThreadId,
	channelId: ChannelId,
	channelContainsExplicitContent?: boolean,
	parentComment?: Comment,
	postDateLinkUpdatePageUrlToPostUrlOnClick?: boolean,
	postDateLinkNavigateToPostUrlOnClick?: boolean,
	showingReplies?: boolean,
	showRepliesCount?: boolean,
	onToggleShowReplies?: () => void,
	toggleShowRepliesButtonRef?: RefObject<HTMLButtonElement>,
	onDownloadThread?: () => Promise<void>,
	locale: Locale,
	messages: Messages,
	url?: string,
	urlBasePath?: string,
	vote?: boolean,
	onVote?: (up: boolean) => Promise<void>,
	onPostUrlClick?: (event: Event, post: Comment) => void,
	mode: Mode,
	onReply?: () => void,
	onReport?: () => void,
	isOwn?: boolean,
	setOwn?: (isOwn: boolean) => void,
	onHide?: () => void,
	moreActionsButtonRef?: RefObject<HTMLButtonElement>
}

// function getFooterBadges(comment, {
// 	parentComment,
// 	showingReplies,
// 	onToggleShowReplies,
// 	toggleShowRepliesButtonRef
// }) {
// 	// Add "show/hide replies" toggle button.
// 	let leftSideBadges = THREAD_STATS_BADGES
// 	// if (hasReplies(comment, parentComment)) {
// 	// 	leftSideBadges = leftSideBadges.concat({
// 	// 		...RepliesCountBadge,
// 	// 		isPressed: showingReplies,
// 	// 		onClick: onToggleShowReplies,
// 	// 		ref: toggleShowRepliesButtonRef
// 	// 	})
// 	// }
// 	return leftSideBadges
// }

export interface CommentInfoIcon {
	name: string,
	title: ({ post, locale, messages }: { post: Comment, locale: Locale, messages: Messages }) => string,
	icon?: React.ElementType,
	getIcon?: ({ post }: { post: Comment }) => React.ElementType,
	getIconProps?: ({ post, messages, locale }: { post: Comment, messages: Messages, locale: Locale }) => Record<string, any>,
	condition?: (post: Comment, params: { isSubscribedThreadInCatalog?: boolean }) => boolean,
	content?: ({ post, locale, messages }: { post: Comment, locale: Locale, messages: Messages }) => ReactNode
}

function addSpacing(rightSideElements: Array<{
	key: keyof typeof RIGHT_SIDE_ELEMENT,
	element: ReactElement
}>) {
	const rightSideElementsWithSpacing = []
	let i = 0
	while (i < rightSideElements.length) {
		const stuff = rightSideElements[i]
		// Add the item.
		rightSideElementsWithSpacing.push(stuff)
		// Add a spacer after the item (if it's not the last one).
		if (i < rightSideElements.length - 1) {
			const nextStuff = rightSideElements[i + 1]
			// "Time" element manages the spacers before and after itself internally
			// due to `<time/>` being rendered as empty when time is less than 1 minute,
			// and when it's empty, its spacers also shouldn't be shown.
			if (nextStuff.key !== 'time' && stuff.key !== 'time') {
				rightSideElementsWithSpacing.push({
					key: stuff.key + ':spacer',
					element: <CommentFooterSeparator/>
				})
			}
		}
		i++
	}
	return rightSideElementsWithSpacing
}

const RIGHT_SIDE_ELEMENT: Record<string, (parameters: RightSideElementParams) => JSX.Element> = {
	vote: ({
		comment,
		vote,
		onVote,
		messages
	}) => (
		<PostVotes
			post={comment}
			vote={vote}
			onVote={onVote}
			messages={messages.post}
		/>
	),
	'comment-info-icons': ({
		comment,
		commentInfoIcons,
		locale,
		messages
	}) => (
		<>
			{commentInfoIcons.map((badge, i: number) => (
				<PostBadge
					key={badge.name}
					post={comment}
					parameters={{ locale, messages }}
					badge={badge}
					className={classNames('CommentFooterBadge', 'CommentFooterBadge--right', `CommentFooterBadge--${badge.name}`, {
						'CommentFooterBadge--last': i === commentInfoIcons.length - 1
					})}
					iconClassName={`CommentFooterBadge-icon CommentFooterBadge-icon--${badge.name}`}
				/>
			))}
		</>
	),
	time: ({
		comment,
		postLinkProps,
		hasAnythingBeforeTime,
		hasAnythingAfterTime,
		locale
	}) => (
		<CommentFooterDate
			postLinkProps={postLinkProps}
			hasAnythingBeforeTime={hasAnythingBeforeTime}
			hasAnythingAfterTime={hasAnythingAfterTime}
			locale={locale}
			date={comment.createdAt}
		/>
	),
	replies: ({
		comment,
		showingReplies,
		showRepliesCount,
		onToggleShowReplies,
		toggleShowRepliesButtonRef,
		messages
	}) => (
		<div className="CommentFooterItem">
			<Padding>
				<PressedStateButton
					ref={toggleShowRepliesButtonRef}
					onClick={onToggleShowReplies}
					title={messages.post.repliesCount}
					pressed={showingReplies}>
					<MessageIcon className="CommentFooterItemIcon CommentFooterItemIcon--replies"/>
					{comment.replies.length}
				</PressedStateButton>
			</Padding>
		</div>
	)
}

interface RightSideElementParams {
	comment: Comment,
	vote?: boolean,
	onVote?: (up: boolean) => Promise<void>,
	locale: Locale,
	messages: Messages,
	commentInfoIcons: ReturnType<typeof getCommentInfoIcons>,
	showingReplies?: boolean,
	showRepliesCount?: boolean,
	onToggleShowReplies?: () => void,
	toggleShowRepliesButtonRef?: RefObject<HTMLButtonElement>,
	hasAnythingBeforeTime: boolean,
	hasAnythingAfterTime: boolean,
	postLinkProps: PostLinkProps
}

interface PostLinkProps {
	url: string,
	baseUrl?: string,
	onClick?: (event: Event, post: Comment) => void,
	updatePageUrlToPostUrlOnClick?: boolean,
	navigateToPostUrlOnClick?: boolean
}