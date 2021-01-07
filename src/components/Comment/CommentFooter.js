import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { useSelector } from 'react-redux'

import {
	comment as commentType,
	threadId,
	channelId
} from '../../PropTypes'

import CommentStatusBadges from './CommentStatusBadges'

import PostBadge from 'webapp-frontend/src/components/PostBadge'
import PostVotes from 'webapp-frontend/src/components/PostVotes'
import HoverButton from 'webapp-frontend/src/components/HoverButton'

import PictureIcon from 'webapp-frontend/assets/images/icons/picture-rect-square-outline-thicker.svg'
import PersonIcon from 'webapp-frontend/assets/images/icons/person-outline.svg'
import CommentIcon from 'webapp-frontend/assets/images/icons/message-rounded-rect-square-thicker.svg'
import MessageIcon from 'webapp-frontend/assets/images/icons/message-rounded-rect-square-thicker.svg'

import { CommentsCountBadge } from 'webapp-frontend/src/components/Post.badges'

import CommentMoreActions from './CommentMoreActions'
import CommentFooterDate from './CommentFooterDate'
import CommentFooterSeparator from './CommentFooterSeparator'

import getMessages from '../../messages'

import './CommentFooter.css'
import './CommentFooterBadge.css'
import 'webapp-frontend/src/components/Padding.css'

export default function CommentFooter({
	comment,
	threadId,
	channelId,
	channelIsNotSafeForWork,
	parentComment,
	showingReplies,
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
	const isTracked = useSelector(({ trackedThreads }) => {
		const trackedThreadsIndex = trackedThreads.trackedThreadsIndex
		return trackedThreadsIndex[channelId] && trackedThreadsIndex[channelId].includes(threadId)
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
	const postLinkProps = useMemo(() => ({
		url: url,
		baseUrl: urlBasePath,
		onClick: onPostUrlClick
	}), [
		url,
		urlBasePath,
		onPostUrlClick
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
	if (onToggleShowReplies) {
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
			rightSideBadges,
			showingReplies,
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
						locale={locale}
						messages={getMessages(locale).post}
						badge={badge}
						className={classNames('CommentFooterBadge', 'CommentFooterBadge--left', `CommentFooterBadge--${badge.name}`, {
							'CommentFooterBadge--last': i === leftSideBadges.length - 1,
							'CommentFooterBadge--ignoreCursor': !badge.title
						})}
						iconClassName={`CommentFooterBadge-icon CommentFooterBadge-icon--${badge.name}`}/>
				))}
			</div>
			<div className="CommentFooter-right">
				<div className="CommentFooter-rightExceptMoreActions">
					{addSpacing(rightSideStuff).map(({ key, element }) => {
						return React.cloneElement(element, { key })
					})}
				</div>
				<CommentMoreActions
					comment={comment}
					threadId={threadId}
					channelId={channelId}
					channelIsNotSafeForWork={channelIsNotSafeForWork}
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
	channelId: channelId.isRequired,
	channelIsNotSafeForWork: PropTypes.bool,
	threadId: threadId.isRequired,
	comment: commentType.isRequired,
	parentComment: commentType,
	showingReplies: PropTypes.bool,
	onToggleShowReplies: PropTypes.func,
	toggleShowRepliesButtonRef: PropTypes.any,
	onPostUrlClick: PropTypes.func.isRequired,
	dispatch: PropTypes.func.isRequired,
	locale: PropTypes.string.isRequired,
	mode: PropTypes.oneOf(['channel', 'thread']).isRequired,
	onReply: PropTypes.func,
	urlBasePath: PropTypes.string.isRequired,
	url: PropTypes.string.isRequired,
	vote: PropTypes.bool,
	onVote: PropTypes.func
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
		locale
	}) => (
		<PostVotes
			post={comment}
			vote={vote}
			onVote={onVote}
			messages={getMessages(locale).post}/>
	),
	'right-side-badges': ({
		comment,
		rightSideBadges,
		locale
	}) => (
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
			date={comment.createdAt}/>
	),
	replies: ({
		comment,
		showingReplies,
		onToggleShowReplies,
		toggleShowRepliesButtonRef,
		locale
	}) => (
		<div className="CommentFooterItem">
			<HoverButton
				ref={toggleShowRepliesButtonRef}
				onClick={onToggleShowReplies}
				title={getMessages(locale).post.repliesCount}
				pushed={showingReplies}
				className="Padding">
				<MessageIcon className="CommentFooterItemIcon CommentFooterItemIcon--replies"/>
				{comment.replies.length}
			</HoverButton>
		</div>
	)
}