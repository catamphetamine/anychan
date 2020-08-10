import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { useSelector } from 'react-redux'

import {
	comment as commentType,
	thread as threadType,
	board as boardType
} from '../../PropTypes'

import CommentStatusBadges from './CommentStatusBadges'

import PostBadge from 'webapp-frontend/src/components/PostBadge'
import PostSelfLink from 'webapp-frontend/src/components/PostSelfLink'
import PostVotes from 'webapp-frontend/src/components/PostVotes'
import HoverButton from 'webapp-frontend/src/components/HoverButton'

import PictureIcon from 'webapp-frontend/assets/images/icons/picture-rect-square-outline-thicker.svg'
import PersonIcon from 'webapp-frontend/assets/images/icons/person-outline.svg'
import CommentIcon from 'webapp-frontend/assets/images/icons/message-rounded-rect-square-thicker.svg'
import MessageIcon from 'webapp-frontend/assets/images/icons/message-rounded-rect-square-thicker.svg'

import { CommentsCountBadge } from 'webapp-frontend/src/components/Post.badges'
// RepliesCountBadge

import CommentMoreActions from './CommentMoreActions'
import ReactTimeAgoWithTooltip from './ReactTimeAgoWithTooltip'

import getMessages from '../../messages'

import './CommentFooter.css'
import './CommentFooterBadge.css'
import 'webapp-frontend/src/components/Padding.css'

export default function CommentFooter({
	comment,
	thread,
	board,
	parentComment,
	showingReplies,
	onShowReplies,
	onToggleShowReplies,
	toggleShowRepliesButtonRef,
	locale,
	dispatch,
	url,
	urlBasePath,
	vote,
	onVote,
	onPostUrlClick,
	mode,
	onReply
}) {
	const isTracked = useSelector(({ threadTracker }) => {
		const trackedThreadsIndex = threadTracker.trackedThreadsIndex
		return trackedThreadsIndex[board.id] && trackedThreadsIndex[board.id].includes(thread.id)
	})
	const rightSideBadges = useMemo(() => {
		let badges = CommentStatusBadges
		// This type of filtering is done in `<Post/>` automatically,
		// but since `leftSideBadges` are also used here outside `<Post/>`,
		// they're filtered here manually.
		badges = badges.filter(({ condition }) => condition(comment, { isTracked }))
		if (badges.length > 0) {
			return badges
		}
	}, [
		comment,
		isTracked
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
	const rightSideStuff = []
	if (onVote) {
		rightSideStuff.push({
			key: 'vote',
			element: (
				<PostVotes
					post={comment}
					vote={vote}
					onVote={onVote}
					messages={getMessages(locale).post}/>
			)
		})
	}
	if (rightSideBadges) {
		rightSideStuff.push({
			key: 'right-side-badges',
			element: (
				<React.Fragment>
					{rightSideBadges.map((badge, i) => (
						<PostBadge
							key={badge.name}
							post={comment}
							locale={locale}
							messages={getMessages(locale).post}
							badge={badge}
							className={classNames('CommentFooterBadge', 'CommentFooterBadge--right', `CommentFooterBadge--${badge.name}`, {
								'CommentFooterBadge--last': i === rightSideBadges.length - 1
							})}
							iconClassName={`CommentFooterBadge-icon CommentFooterBadge-icon--${badge.name}`}/>
					))}
				</React.Fragment>
			)
		})
	}
	const hasAnythingBeforeTime = rightSideStuff.length > 0
	const timeWrapperProps = useMemo(() => ({
		hasAnythingBeforeTime,
		postLinkProps: {
			url: url,
			baseUrl: urlBasePath,
			onClick: onPostUrlClick
		}
	}), [
		hasAnythingBeforeTime,
		url,
		urlBasePath,
		onPostUrlClick
	])
	if (true) {
		rightSideStuff.push({
			key: 'time',
			element: (
				<ReactTimeAgoWithTooltip
					wrapperComponent={TimeWrapper}
					wrapperProps={timeWrapperProps}
					locale={locale}
					timeStyle="twitter"
					date={comment.createdAt}/>
			)
		})
	}
	if (onShowReplies) {
		rightSideStuff.push({
			key: 'replies',
			element: (
				<div className="CommentFooterItem">
					<HoverButton
						ref={toggleShowRepliesButtonRef}
						onClick={onShowReplies}
						title={getMessages(locale).post.repliesCount}
						pushed={showingReplies}
						className="Padding">
						<MessageIcon className="CommentFooterItemIcon CommentFooterItemIcon--replies"/>
						{comment.replies.length}
					</HoverButton>
				</div>
			)
		})
	}
	const rightSideStuffSpaced = []
	let i = 0
	while (i < rightSideStuff.length) {
		const stuff = rightSideStuff[i]
		// Add the item.
		rightSideStuffSpaced.push(stuff)
		// Add spacer after the item (if it's not the last one).
		if (i < rightSideStuff.length - 1) {
			const nextStuff = rightSideStuff[i + 1]
			// "Time" element manages the spacer before itself internally
			// due to `<time/>` being rendered as empty when time is less than 1 minute,
			// and when it's empty, its spacer also shouldn't be shown.
			if (nextStuff.key !== 'time') {
				rightSideStuffSpaced.push({
					key: stuff.key + ':spacer',
					element: <CommentFooterSeparator/>
				})
			}
		}
		i++
	}
	return (
		<div className="CommentFooter">
			<div className="CommentFooter-left">
				{leftSideBadges && leftSideBadges.map((badge, i) => (
					<PostBadge
						key={badge.name}
						post={comment}
						locale={locale}
						messages={getMessages(locale).post}
						badge={badge}
						className={classNames('CommentFooterBadge', 'CommentFooterBadge--left', `CommentFooterBadge--${badge.name}`, {
							'CommentFooterBadge--last': i === leftSideBadges.length - 1
						})}
						iconClassName={`CommentFooterBadge-icon CommentFooterBadge-icon--${badge.name}`}/>
				))}
			</div>
			<div className="CommentFooter-right">
				{rightSideStuffSpaced.map(({ key, element }) => React.cloneElement(element, { key }))}
				<CommentMoreActions
					comment={comment}
					thread={thread}
					board={board}
					dispatch={dispatch}
					locale={locale}
					mode={mode}
					onReply={onReply}
					urlBasePath={urlBasePath}
					url={url}/>
			</div>
		</div>
	)
}

CommentFooter.propTypes = {
	board: boardType.isRequired,
	thread: threadType.isRequired,
	comment: commentType.isRequired,
	parentComment: commentType,
	showingReplies: PropTypes.bool,
	onShowReplies: PropTypes.func,
	onToggleShowReplies: PropTypes.func,
	toggleShowRepliesButtonRef: PropTypes.any,
	onPostUrlClick: PropTypes.func.isRequired,
	dispatch: PropTypes.func.isRequired,
	locale: PropTypes.string.isRequired,
	mode: PropTypes.oneOf(['board', 'thread']).isRequired,
	onReply: PropTypes.func,
	urlBasePath: PropTypes.string.isRequired,
	url: PropTypes.string.isRequired,
	vote: PropTypes.bool,
	onVote: PropTypes.func
}

function CommentFooterSeparator() {
	return (
		<div className="CommentFooter-separator">
			·
		</div>
	)
}

function TimeWrapper({
	postLinkProps,
	hasAnythingBeforeTime,
	children
}) {
	return (
		<React.Fragment>
			{hasAnythingBeforeTime &&
				<CommentFooterSeparator/>
			}
			<PostSelfLink {...postLinkProps}>
				{children}
			</PostSelfLink>
		</React.Fragment>
	)
}

TimeWrapper.propTypes = {
	postLinkProps: PropTypes.object.isRequired,
	hasAnythingBeforeTime: PropTypes.bool.isRequired,
	children: PropTypes.node.isRequired
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
// 	// 		isPushed: showingReplies,
// 	// 		onClick: onToggleShowReplies,
// 	// 		ref: toggleShowRepliesButtonRef
// 	// 	})
// 	// }
// 	return leftSideBadges
// }

const THREAD_STATS_BADGES = [
	{
		...CommentsCountBadge,
		icon: CommentIcon
	},
	{
		name: 'attachments-count',
		icon: PictureIcon,
		title: ({ post, locale }) => getMessages(locale).post.attachmentsCount,
		condition: (post) => post.attachmentsCount,
		content: ({ post }) => post.attachmentsCount
	},
	{
		name: 'unique-posters-count',
		icon: PersonIcon,
		title: ({ post, locale }) => getMessages(locale).post.uniquePostersCount,
		condition: (post) => post.uniquePostersCount,
		content: ({ post }) => post.uniquePostersCount
	}
]