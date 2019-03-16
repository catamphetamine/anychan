import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import ArhivachIcon from '../../assets/images/icons/services/arhivach.svg'

import Post from 'webapp-frontend/src/components/Post'
import OnClick from 'webapp-frontend/src/components/OnClick'

import {
	ContentSection,
	ContentSectionHeader
} from 'webapp-frontend/src/components/ContentSection'

import { getChan } from '../chan'
import getMessages from '../messages'
import getBasePath from '../utility/getBasePath'
import configuration from '../configuration'

import StopIcon from 'webapp-frontend/assets/images/icons/stop.svg'
import PinIcon from 'webapp-frontend/assets/images/icons/pin.svg'
import InfinityIcon from 'webapp-frontend/assets/images/icons/infinity.svg'
import LockIcon from 'webapp-frontend/assets/images/icons/lock.svg'
import SinkingBoatIcon from '../../assets/images/icons/sinking-boat.svg'

import './ThreadComment.css'

const BADGES = [
	{
		name: 'banned',
		icon: StopIcon,
		title: locale => getMessages(locale).post.banned,
		condition: post => post.authorWasBanned
	},
	{
		name: 'bump-limit',
		icon: SinkingBoatIcon,
		title: locale => getMessages(locale).post.bumpLimitReached,
		condition: (post, thread) => post.id === thread.id && thread.isBumpLimitReached && !thread.isSticky
	},
	{
		name: 'sticky',
		icon: PinIcon,
		title: locale => getMessages(locale).post.sticky,
		condition: (post, thread) => post.id === thread.id && thread.isSticky
	},
	{
		name: 'rolling',
		icon: InfinityIcon,
		title: locale => getMessages(locale).post.rolling,
		condition: (post, thread) => post.id === thread.id && thread.isRolling
	},
	{
		name: 'closed',
		icon: LockIcon,
		title: locale => getMessages(locale).post.closed,
		condition: (post, thread) => post.id === thread.id && thread.isClosed
	}
]

// Passing `locale` as an explicit property instead to avoid having
// a lot of `@connect()`s executing on pages with a lot of posts.
// @connect(({ app }) => ({
// 	locale: app.settings.locale
// }))
export default class ThreadComment extends React.Component {
	state = {
		hidden: this.props.comment.hidden
	}

	toggleShowHide = () => {
		this.setState(({ hidden }) => ({
			hidden: !hidden
		}))
	}

	onClick = (event) => {
		const { board, thread, comment, onClick } = this.props
		const { hidden } = this.state
		event.preventDefault()
		if (hidden) {
			return this.toggleShowHide()
		}
		onClick(comment, thread, board)
	}

	render() {
		const {
			onClick,
			getUrl,
			board,
			thread,
			comment,
			mode,
			locale,
			openSlideshow
		} = this.props

		const { hidden } = this.state

		// `4chan.org` displays attachment thumbnails as `125px`
		// (half the size) when they're not "OP posts".
		const commentElement = (
			<Comment
				compact={mode === 'thread'}
				comment={comment}
				thread={thread}
				hidden={hidden}
				url={getUrl(board, thread, comment)}
				locale={locale}
				openSlideshow={openSlideshow}
				halfSizedAttachmentThumbnails={getChan().id === '4chan' && comment.id !== thread.id}/>
		)

		if (hidden || onClick) {
			return (
				<OnClick
					id={comment.id}
					filter={commentOnClickFilter}
					onClick={hidden || onClick ? this.onClick : undefined}
					link={hidden || onClick ? (getBasePath() || '') + getUrl(board, thread) : undefined}
					onClickClassName="thread__comment-container--click"
					className="thread__comment-container">
					{commentElement}
				</OnClick>
			)
		}

		return (
			<div
				id={comment.id}
				className="thread__comment-container">
				{commentElement}
			</div>
		)
	}
}

ThreadComment.propTypes = {
	mode: PropTypes.oneOf(['board', 'thread']),
	getUrl: PropTypes.func.isRequired,
	onClick: PropTypes.func,
	board: PropTypes.shape({
		id: PropTypes.string.isRequired
	}).isRequired,
	thread: PropTypes.shape({
		id: PropTypes.string.isRequired
	}).isRequired,
	comment: PropTypes.object.isRequired,
	locale: PropTypes.string.isRequired,
	openSlideshow: PropTypes.func.isRequired
}

function Comment({
	halfSizedAttachmentThumbnails,
	comment,
	thread,
	compact,
	hidden,
	url,
	locale,
	openSlideshow
}) {
	if (hidden) {
		return (
			<ContentSection
				className={classNames('thread__comment', {
					'thread__comment--hidden': hidden,
					// 'thread__comment--with-subject': comment.subject
				})}>
				{getMessages(locale).hiddenPost}
				{comment.hiddenRule && ` (${comment.hiddenRule})`}
			</ContentSection>
		)
	}
	return (
		<Post
			post={comment}
			thread={thread}
			url={url}
			locale={locale}
			readMoreLabel={getMessages(locale).post.readMore}
			badges={BADGES}
			replies={comment.replies}
			compact={compact}
			saveBandwidth
			openSlideshow={openSlideshow}
			serviceIcons={SERVICE_ICONS}
			youTubeApiKey={configuration.youTubeApiKey}
			expandFirstPictureOrVideo={false}
			maxAttachmentThumbnails={false}
			attachmentThumbnailSize={halfSizedAttachmentThumbnails ? getChan().thumbnailSize / 2 : getChan().thumbnailSize}
			className="thread__comment content-section" />
	);
}

Comment.propTypes = {
	comment: PropTypes.object.isRequired,
	thread: PropTypes.object.isRequired,
	hidden: PropTypes.bool,
	url: PropTypes.string.isRequired,
	locale: PropTypes.string.isRequired,
	openSlideshow: PropTypes.func.isRequired,
	halfSizedAttachmentThumbnails: PropTypes.bool
}

export function commentOnClickFilter(element) {
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