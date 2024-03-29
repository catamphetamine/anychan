import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import classNames from 'classnames'

import {
	comment as commentType,
	threadId,
	channelId
} from '../../PropTypes.js'

import getCommentFooterBadges from './getCommentFooterBadges.js'

import PostBadge from 'social-components-react/components/PostBadge.js'
import PostVotes from 'social-components-react/components/PostVotes.js'
import PressedStateButton from 'social-components-react/components/PressedStateButton.js'
import Padding from 'social-components-react/components/Padding.js'

import PictureIcon from 'frontend-lib/icons/picture-rect-square-outline-thicker.svg'
import PersonIcon from 'frontend-lib/icons/person-outline-no-bottom-border.svg'
import CommentIcon from 'frontend-lib/icons/message-rounded-rect-square-thicker.svg'
import MessageIcon from 'frontend-lib/icons/message-rounded-rect-square-thicker.svg'
// import ReplyIcon from 'frontend-lib/icons/reply.svg'

import CommentMoreActions from './CommentMoreActions.js'
import CommentFooterDate from './CommentFooterDate.js'
import CommentFooterSeparator from './CommentFooterSeparator.js'

import getMessages from '../../messages/getMessages.js'

import useDataSource from '../../hooks/useDataSource.js'

import './CommentFooter.css'
import './CommentFooterBadge.css'

export default function CommentFooter({
	comment,
	threadId,
	channelId,
	channelIsNotSafeForWork,
	parentComment,
	postDateLinkUpdatePageUrlToPostUrlOnClick,
	postDateLinkNavigateToPostUrlOnClick,
	showingReplies,
	showRepliesCount,
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
}) {
	const dataSource = useDataSource()

	const subscribedThreadIds = useSelector(state => state.channel.subscribedThreadIds)

	const isSubscribedThreadInCatalog = useMemo(() => {
		if (mode === 'channel') {
			return subscribedThreadIds.includes(threadId)
		}
	}, [
		subscribedThreadIds,
		channelId,
		threadId
	])

	const rightSideBadges = useMemo(() => {
		let badges = getCommentFooterBadges({ dataSource, isOwnComment: isOwn })
		// This type of filtering is done in `<Post/>` automatically,
		// but since `leftSideBadges` are also used here outside `<Post/>`,
		// they're filtered here manually.
		badges = badges.filter(({ condition }) => condition(comment, { isSubscribedThreadInCatalog }))
		if (badges.length > 0) {
			return badges
		}
	}, [
		comment,
		dataSource,
		isSubscribedThreadInCatalog,
		isOwn
	])

	const leftSideBadges = useMemo(() => {
		// let badges = getFooterBadges(comment, {
		// 	parentComment,
		// 	showingReplies,
		// 	onToggleShowReplies,
		// 	toggleShowRepliesButtonRef
		// })
		let badges = THREAD_STATS_BADGES
		// This type of filtering is done in `<Post/>` automatically,
		// but since `leftSideBadges` are also used here outside `<Post/>`,
		// they're filtered here manually.
		badges = badges.filter(({ condition }) => condition(comment))
		if (badges.length > 0) {
			return badges
		}
	}, [
		comment
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

	let rightSideStuff = []
	if (onVote) {
		rightSideStuff.push('vote')
	}
	if (rightSideBadges) {
		rightSideStuff.push('right-side-badges')
	}
	if (true) {
		rightSideStuff.push('time')
	}
	if (showRepliesCount && comment.replies) {
		rightSideStuff.push('replies')
	}
	const timeElementIndex = rightSideStuff.indexOf('time')
	rightSideStuff = rightSideStuff.map((key) => ({
		key,
		element: RIGHT_SIDE_STUFF[key]({
			comment,
			vote,
			onVote,
			locale,
			messages,
			rightSideBadges,
			showingReplies,
			showRepliesCount,
			onToggleShowReplies,
			toggleShowRepliesButtonRef,
			hasAnythingBeforeTime: timeElementIndex > 0,
			hasAnythingAfterTime: timeElementIndex >= 0 && timeElementIndex < rightSideStuff.length - 1,
			postLinkProps
		})
	}))

	return (
		<div className="CommentFooter">
			<div className="CommentFooter-left">
				{leftSideBadges && leftSideBadges.map((badge, i) => (
					<PostBadge
						key={badge.name}
						post={comment}
						parameters={{ locale, messages }}
						badge={badge}
						className={classNames('CommentFooterBadge', 'CommentFooterBadge--left', `CommentFooterBadge--${badge.name}`, {
							'CommentFooterBadge--last': i === leftSideBadges.length - 1,
							'CommentFooterBadge--ignoreCursor': !badge.title
						})}
						iconClassName={`CommentFooterBadge-icon CommentFooterBadge-icon--${badge.name}`}
					/>
				))}
			</div>
			<div className="CommentFooter-right">
				<div className="CommentFooter-rightExceptMoreActions">
					{addSpacing(rightSideStuff).map(({ key, element }) => {
						return React.cloneElement(element, { key })
					})}
				</div>
				<CommentMoreActions
					buttonRef={moreActionsButtonRef}
					comment={comment}
					threadId={threadId}
					channelId={channelId}
					channelIsNotSafeForWork={channelIsNotSafeForWork}
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
	channelIsNotSafeForWork: PropTypes.bool,
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

CommentFooter.defaultProps = {
	showRepliesCount: true
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

const THREAD_STATS_BADGES = [
	{
		name: 'comments-count',
		icon: CommentIcon,
		title: ({ post, messages }) => messages && messages.commentsCount,
		// `.commentsCount` is set on the first comment of a thread
		// as `thread.comments[0].commentsCount = thread.commentsCount`.
		condition: (post) => post.commentsCount > 1,
		content: ({ post }) => post.commentsCount - 1
	},
	// {
	// 	name: 'replies-count',
	// 	icon: ReplyIcon,
	// 	title: ({ post, messages }) => messages && messages.repliesCount,
	// 	condition: (post) => post.replies && post.replies.length > 0,
	// 	content: ({ post }) => post.replies.length
	// },
	{
		name: 'attachments-count-in-comments',
		icon: PictureIcon,
		title: ({ post, messages }) => messages.commentAttachmentsCount,
		// `.commentAttachmentsCount` is set on the first comment of a thread in `addCommentProps.js`:
		// `thread.comments[0].commentAttachmentsCount = thread.commentAttachmentsCount`.
		// condition: (post) => post.attachmentsCount > (post.attachments ? post.attachments.length : 0),
		// content: ({ post }) => post.attachmentsCount - (post.attachments ? post.attachments.length : 0)
		condition: (post) => post.commentAttachmentsCount > 0,
		content: ({ post }) => post.commentAttachmentsCount
	},
	{
		name: 'unique-posters-count',
		icon: PersonIcon,
		title: ({ post, messages }) => messages.uniquePostersCount,
		condition: (post) => post.uniquePostersCount,
		content: ({ post }) => post.uniquePostersCount
	}
]

function addSpacing(rightSideStuff) {
	const rightSideStuffSpaced = []
	let i = 0
	while (i < rightSideStuff.length) {
		const stuff = rightSideStuff[i]
		// Add the item.
		rightSideStuffSpaced.push(stuff)
		// Add a spacer after the item (if it's not the last one).
		if (i < rightSideStuff.length - 1) {
			const nextStuff = rightSideStuff[i + 1]
			// "Time" element manages the spacers before and after itself internally
			// due to `<time/>` being rendered as empty when time is less than 1 minute,
			// and when it's empty, its spacers also shouldn't be shown.
			if (nextStuff.key !== 'time' && stuff.key !== 'time') {
				rightSideStuffSpaced.push({
					key: stuff.key + ':spacer',
					element: <CommentFooterSeparator/>
				})
			}
		}
		i++
	}
	return rightSideStuffSpaced
}

const RIGHT_SIDE_STUFF = {
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
	'right-side-badges': ({
		comment,
		rightSideBadges,
		locale,
		messages
	}) => (
		<>
			{rightSideBadges.map((badge, i) => (
				<PostBadge
					key={badge.name}
					post={comment}
					parameters={{ locale, messages }}
					badge={badge}
					className={classNames('CommentFooterBadge', 'CommentFooterBadge--right', `CommentFooterBadge--${badge.name}`, {
						'CommentFooterBadge--last': i === rightSideBadges.length - 1
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