import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import ArhivachIcon from '../../assets/images/icons/services/arhivach.svg'

import CommentIcon from 'webapp-frontend/assets/images/icons/menu/message-outline.svg'
import PictureIcon from 'webapp-frontend/assets/images/icons/picture.svg'
import PersonIcon from 'webapp-frontend/assets/images/icons/menu/person-outline.svg'
import ReplyIcon from 'webapp-frontend/assets/images/icons/reply.svg'

import CountryFlag from './CountryFlag'

import Post from 'webapp-frontend/src/components/Post'
import OnClick from 'webapp-frontend/src/components/OnClick'

import {
	ContentSection,
	ContentSectionHeader
} from 'webapp-frontend/src/components/ContentSection'

import { getChan, shouldUseRelativeUrls } from '../chan'
import getMessages, { getCountryNames } from '../messages'
import getBasePath from '../utility/getBasePath'
import configuration from '../configuration'

import StopIcon from 'webapp-frontend/assets/images/icons/stop.svg'
import AnonymousIcon from '../../assets/images/icons/anonymous.svg'
import PinIcon from 'webapp-frontend/assets/images/icons/pin.svg'
import InfinityIcon from 'webapp-frontend/assets/images/icons/infinity.svg'
import LockIcon from 'webapp-frontend/assets/images/icons/lock.svg'
import SinkingBoatIcon from '../../assets/images/icons/sinking-boat.svg'

import './ThreadComment.css'

const HEADER_BADGES = [
	{
		name: 'banned',
		icon: StopIcon,
		title: (post, locale) => getMessages(locale).post.banned,
		condition: post => post.authorWasBanned
	},
	{
		name: 'original-poster',
		icon: AnonymousIcon,
		title: (post, locale) => getMessages(locale).post.originalPoster,
		condition: post => post.isOriginalPoster
	},
	{
		name: 'country',
		getIcon: (post, locale) => {
			if (post.authorCountry) {
				return CountryFlagBadge
			}
			return ChanFlagBadge
		},
		getIconProps: (post, locale) => {
			if (post.authorCountry) {
				return {
					country: post.authorCountry,
					name: getCountryNames(locale)[post.authorCountry]
				}
			}
			return {
				country: post.authorCountryId,
				name: post.authorCountryName
			}
		},
		title: (post, locale) => post.authorCountryName || getCountryNames(locale)[post.authorCountry],
		condition: post => post.authorCountry || post.authorCountryName
	},
	{
		name: 'bump-limit',
		icon: SinkingBoatIcon,
		title: (post, locale) => getMessages(locale).post.bumpLimitReached,
		condition: (post, thread) => post.id === thread.id && thread.isBumpLimitReached && !thread.isSticky
	},
	{
		name: 'sticky',
		icon: PinIcon,
		title: (post, locale) => getMessages(locale).post.sticky,
		condition: (post, thread) => post.id === thread.id && thread.isSticky
	},
	{
		name: 'rolling',
		icon: InfinityIcon,
		title: (post, locale) => getMessages(locale).post.rolling,
		condition: (post, thread) => post.id === thread.id && thread.isRolling
	},
	{
		name: 'closed',
		icon: LockIcon,
		title: (post, locale) => getMessages(locale).post.closed,
		condition: (post, thread) => post.id === thread.id && thread.isClosed
	}
]

const FOOTER_BADGES = [
	{
		name: 'comments-count',
		icon: CommentIcon,
		title: (post, locale) => getMessages(locale).post.commentsCount,
		condition: (post) => post.commentsCount,
		content: post => post.commentsCount
	},
	{
		name: 'comment-attachments-count',
		icon: PictureIcon,
		title: (post, locale) => getMessages(locale).post.commentAttachmentsCount,
		condition: (post) => post.commentAttachmentsCount,
		content: post => post.commentAttachmentsCount
	},
	{
		name: 'unique-posters-count',
		icon: PersonIcon,
		title: (post, locale) => getMessages(locale).post.uniquePostersCount,
		condition: (post) => post.uniquePostersCount,
		content: post => post.uniquePostersCount
	},
	{
		name: 'replies-count',
		icon: ReplyIcon,
		title: (post, locale) => getMessages(locale).post.repliesCount,
		condition: (post) => post.replies && post.replies.length > 0,
		content: post => post.replies.length,
		onClick: (post) => alert('Not implemented yet')
	}
]

export default class ThreadComment extends React.PureComponent {
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
				mode={mode}
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
	mode,
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
			moreActionsLabel={getMessages(locale).post.moreActions}
			readMoreLabel={getMessages(locale).post.readMore}
			replyLabel={mode === 'thread' ? getMessages(locale).post.reply : undefined}
			onReply={mode === 'thread' ? () => alert('Not implemented yet') : undefined}
			headerBadges={HEADER_BADGES}
			footerBadges={FOOTER_BADGES}
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
	mode: PropTypes.oneOf(['board', 'thread']),
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

function ChanFlag({ country, name, ...rest }) {
	let countryFlagUrl = getChan().countryFlagUrl
	// Transform relative URL to an absolute one.
	if (countryFlagUrl[0] === '/' && countryFlagUrl[1] !== '/') {
		if (!shouldUseRelativeUrls() ) {
			countryFlagUrl = getChan().website + countryFlagUrl
		}
	}
	return (
		<img
			{...rest}
			alt={name}
			src={countryFlagUrl.replace('{country}', country)}
			className="post__custom-country-flag"/>
	)
}

function ChanFlagBadge({ className, ...rest }) {
	return (
		<div className={className}>
			<ChanFlag {...rest}/>
		</div>
	)
}

function CountryFlagBadge({ className, ...rest }) {
	return (
		<div className={className}>
			<CountryFlag {...rest}/>
		</div>
	)
}