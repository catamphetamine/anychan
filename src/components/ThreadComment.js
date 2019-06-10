import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import ArhivachIcon from '../../assets/images/icons/services/arhivach.svg'
import AnonymousPersonIcon from '../../assets/images/icons/person-outline-anonymous.svg'

import PictureIcon from 'webapp-frontend/assets/images/icons/picture.svg'
import PersonIcon from 'webapp-frontend/assets/images/icons/menu/person-outline.svg'
import PersonFillIcon from 'webapp-frontend/assets/images/icons/menu/person-fill.svg'
import DislikeIcon from 'webapp-frontend/assets/images/icons/dislike.svg'

import CountryFlag from './CountryFlag'
import PostForm from './PostForm'

import Post from 'webapp-frontend/src/components/Post'
import { CommentsCountBadge, RepliesCountBadge } from 'webapp-frontend/src/components/Post.badges'
import { isMiddleDialogueChainLink } from 'webapp-frontend/src/components/CommentTree'
import OnClick from 'webapp-frontend/src/components/OnClick'

import {
	ContentSection,
	ContentSectionHeader
} from 'webapp-frontend/src/components/ContentSection'

import { getChan, shouldUseRelativeUrls } from '../chan'
import getMessages, { getCountryNames } from '../messages'
import getBasePath from '../utility/getBasePath'
import getUrl from '../utility/getUrl'
import configuration from '../configuration'

import { post } from '../PropTypes'

import StopIcon from 'webapp-frontend/assets/images/icons/stop.svg'
import AnonymousIcon from '../../assets/images/icons/anonymous.svg'
import PinIcon from 'webapp-frontend/assets/images/icons/pin.svg'
import InfinityIcon from 'webapp-frontend/assets/images/icons/infinity.svg'
import LockIcon from 'webapp-frontend/assets/images/icons/lock.svg'
import SinkingBoatIcon from '../../assets/images/icons/sinking-boat.svg'

import './ThreadComment.css'

export default class ThreadComment extends React.PureComponent {
	state = {
		hidden: this.props.comment.hidden,
		showReplyForm: this.props.initialShowReplyForm
	}

	replyForm = React.createRef()

	toggleShowHide = () => {
		this.setState(({ hidden }) => ({
			hidden: !hidden
		}))
	}

	toggleShowReplyForm = (value, callback) => {
		const {
			onToggleShowReplyForm,
			onContentDidChange
		} = this.props
		if (onToggleShowReplyForm) {
			onToggleShowReplyForm(value)
		}
		this.setState({
			showReplyForm: value
		}, () => {
			// `virtual-scroller` item height is reduced when reply form is hidden.
			if (onContentDidChange) {
				onContentDidChange()
			}
			if (callback) {
				callback()
			}
		})
	}

	showReplyForm = (callback) => this.toggleShowReplyForm(true, callback)
	hideReplyForm = (callback) => this.toggleShowReplyForm(false, callback)

	onClick = (event) => {
		const { board, thread, comment, onClick } = this.props
		event.preventDefault()
		onClick(comment, thread, board)
	}

	onVote = (vote) => {
		const { notify } = this.props
		notify('Not implemented yet')
	}

	onReply = () => {
		const { notify } = this.props
		const { showReplyForm } = this.state
		notify('Not implemented yet')
		// if (showReplyForm) {
		// 	this.replyForm.current.focus()
		// } else {
		// 	this.showReplyForm(() => {
		// 		// The form auto-focuses on mount.
		// 		// this.replyForm.current.focus()
		// 	})
		// }
	}

	onCancelReply = () => {
		this.hideReplyForm(() => {
			// .focus() the "Reply" button of `this.postRef.current` here.
		})
	}

	onSubmitReply = ({ content }) => {
		const { notify } = this.props
		notify('Not implemented yet')
		// Disable reply form.
		// Show a spinner.
		// Wait for the new comment to be fetched as part of thread auto-update.
		// Hide the reply form.
		// Focus the "Reply" button of `this.postRef.current` here.
	}

	render() {
		const {
			onClick,
			onClickUrl,
			board,
			thread,
			comment,
			mode,
			locale,
			openSlideshow,
			notify,
			parentComment,
			showingReplies,
			onToggleShowReplies,
			toggleShowRepliesButtonRef,
			initialExpandContent,
			onExpandContent,
			onContentDidChange,
			postRef
		} = this.props

		const {
			hidden,
			showReplyForm
		} = this.state

		// `4chan.org` displays attachment thumbnails as `125px`
		// (half the size) when they're not "OP posts".
		const commentElement = (
			<Comment
				postRef={postRef}
				compact={mode === 'thread' && comment.id !== thread.id}
				comment={comment}
				thread={thread}
				hidden={hidden}
				url={getUrl(board, thread, comment)}
				locale={locale}
				openSlideshow={openSlideshow}
				notify={notify}
				onReply={mode === 'thread' && !thread.isLocked ? this.onReply : undefined}
				onVote={thread.hasVoting ? this.onVote : undefined}
				parentComment={parentComment}
				showingReplies={showingReplies}
				onToggleShowReplies={onToggleShowReplies}
				toggleShowRepliesButtonRef={toggleShowRepliesButtonRef}
				initialExpandContent={initialExpandContent}
				onExpandContent={onExpandContent}
				onContentDidChange={onContentDidChange}
				className={classNames(`thread__comment--${mode}`, {
					'thread__comment--opening': mode === 'thread' && comment.id === thread.id
				})}/>
		)

		const id = parentComment ? undefined : comment.id

		if (hidden || onClick) {
			return (
				<OnClick
					id={id}
					filter={commentOnClickFilter}
					onClick={hidden ? this.toggleShowHide : (onClick ? this.onClick : undefined)}
					url={(getBasePath() || '') + onClickUrl}
					onClickClassName="thread__comment-container--click"
					className="thread__comment-container">
					{commentElement}
				</OnClick>
			)
		}

		const replyForm = showReplyForm ? (
			<PostForm
				ref={this.replyForm}
				locale={locale}
				onCancel={this.onCancelReply}
				onSubmit={this.onSubmitReply}/>
		) : null

		return (
			<div
				id={id}
				className="thread__comment-container">
				{commentElement}
				{replyForm}
			</div>
		)
	}
}

ThreadComment.propTypes = {
	mode: PropTypes.oneOf(['board', 'thread']),
	getUrl: PropTypes.func.isRequired,
	onClick: PropTypes.func,
	onClickUrl: PropTypes.string,
	board: PropTypes.shape({
		id: PropTypes.string.isRequired
	}).isRequired,
	thread: PropTypes.shape({
		id: PropTypes.string.isRequired
	}).isRequired,
	comment: post.isRequired,
	locale: PropTypes.string.isRequired,
	openSlideshow: PropTypes.func.isRequired,
	notify: PropTypes.func.isRequired,
	parentComment: post,
	showingReplies: PropTypes.bool,
	onToggleShowReplies: PropTypes.func,
	toggleShowRepliesButtonRef: PropTypes.any,
	initialExpandContent: PropTypes.bool,
	onExpandContent: PropTypes.func,
	initialShowReplyForm: PropTypes.bool,
	onToggleShowReplyForm: PropTypes.func,
	onContentDidChange: PropTypes.func,
	postRef: PropTypes.any
}

function Comment({
	comment,
	compact,
	hidden,
	url,
	locale,
	openSlideshow,
	notify,
	onReply,
	onVote,
	parentComment,
	showingReplies,
	toggleShowRepliesButtonRef,
	onToggleShowReplies,
	initialExpandContent,
	onExpandContent,
	onContentDidChange,
	postRef,
	className
}) {
	if (hidden) {
		return (
			<HiddenPostComponent post={comment} locale={locale}/>
		)
	}
	// Add "show/hide replies" toggle button.
	let footerBadges = FOOTER_BADGES
	if (comment.replies && !(parentComment && isMiddleDialogueChainLink(comment, parentComment))) {
		footerBadges = footerBadges.concat({
			...RepliesCountBadge,
			isPushed: showingReplies,
			onClick: onToggleShowReplies,
			ref: toggleShowRepliesButtonRef
		})
	}
	// `4chan.org` displays attachment thumbnails as `125px`
	// (half the size) when they're not "OP posts".
	const showHalfSizedAttachmentThumbnails = getChan().id === '4chan' && !comment.isRootComment
	return (
		<Post
			ref={postRef}
			post={comment}
			url={url}
			locale={locale}
			header={Header}
			messages={getMessages(locale).post}
			onReply={onReply}
			onMoreActions={() => notify('Not implemented yet')}
			initialExpandContent={initialExpandContent}
			onExpandContent={onExpandContent}
			onContentDidChange={onContentDidChange}
			onVote={onVote}
			headerBadges={HEADER_BADGES}
			footerBadges={footerBadges}
			compact={compact}
			saveBandwidth
			openSlideshow={openSlideshow}
			serviceIcons={SERVICE_ICONS}
			youTubeApiKey={configuration.youTubeApiKey}
			expandFirstPictureOrVideo={false}
			maxAttachmentThumbnails={false}
			attachmentThumbnailSize={showHalfSizedAttachmentThumbnails ? getChan().thumbnailSize / 2 : getChan().thumbnailSize}
			className={classNames(className, 'thread__comment', 'content-section')} />
	)
}

Comment.propTypes = {
	comment: post.isRequired,
	hidden: PropTypes.bool,
	url: PropTypes.string.isRequired,
	locale: PropTypes.string.isRequired,
	openSlideshow: PropTypes.func.isRequired,
	onReply: PropTypes.func,
	onVote: PropTypes.func,
	parentComment: post,
	showingReplies: PropTypes.bool,
	onToggleShowReplies: PropTypes.func,
	toggleShowRepliesButtonRef: PropTypes.any,
	postRef: PropTypes.any,
	initialShowReplyForm: PropTypes.bool,
	onToggleShowReplyForm: PropTypes.func,
	onContentDidChange: PropTypes.func,
	className: PropTypes.string
}

function commentOnClickFilter(element) {
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
	// Fix `2ch.hk` bug: `krym.png` has `.gif` extension.
	// https://2ch.hk/icons/logos/krym.gif
	if (getChan().id === '2ch' && country === 'krym') {
		countryFlagUrl = countryFlagUrl.replace(/\.png$/, '.gif')
	}
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

function Header({ post, locale }) {
	let authorName = post.authorName
	let authorNameIsOriginalPoster = false
	if (post.threadHasAuthorIds && post.isThreadAuthor) {
		authorName = getMessages(locale).post.threadAuthor
		authorNameIsOriginalPoster = true
	}
	if (!(post.authorId || authorName || post.authorEmail || post.authorRole || post.tripCode)) {
		return null
	}
	const authorRoleName = post.authorRole && (getRoleName(post.authorRole, post, locale) || post.authorRole)
	return (
		<div
			className={classNames(
				'post__author',
				post.authorRole && `post__author--${post.authorRole}`,
				{
					'post__author--generic': !post.authorRole,
					'post__author--eligible': post.threadHasAuthorIds
				}
			)}>
			<div className="post__author-icon-container">
				{authorNameIsOriginalPoster &&
					<AnonymousPersonIcon className="post__author-icon"/>
				}
				{!authorNameIsOriginalPoster &&
					<PersonIcon
						className={classNames('post__author-icon', {
							'post__author-icon--outline': post.authorIdColor
						})}/>
				}
				{post.authorIdColor &&
					<PersonFillIcon
						className="post__author-icon"
						style={{
							color: post.authorIdColor
						}}/>
				}
			</div>
			{(post.authorId || authorName || post.authorEmail || post.authorRole) &&
				<div className="post__author-name">
					{post.authorId && !post.authorNameId && `${post.authorId} `}
					{authorName && `${authorName} `}
					{post.authorRole && !(post.authorId || authorName) && `${authorRoleName} `}
					{post.authorRole &&  (post.authorId || authorName) && `(${authorRoleName.toLowerCase()}) `}
					{post.authorEmail &&
						<span>
							<a href={`mailto:${post.authorEmail}`}>
								{post.authorEmail}
							</a>
							{' '}
						</span>
					}
				</div>
			}
			{post.tripCode &&
				<div className="post__author-trip-code">
					{post.tripCode}
				</div>
			}
		</div>
	)
}

const HEADER_BADGES = [
	{
		name: 'banned',
		icon: StopIcon,
		title: (post, locale) => getMessages(locale).post.banned,
		condition: post => post.authorWasBanned
	},
	{
		name: 'sage',
		icon: DislikeIcon,
		title: (post, locale) => 'Sage',
		condition: post => post.isSage
	},
	{
		name: 'original-poster',
		icon: AnonymousIcon,
		title: (post, locale) => getMessages(locale).post.threadAuthor,
		// If there are author IDs in the thread then "Original poster" is
		// gonna be the post author name instead of being a badge.
		condition: post => post.isThreadAuthor && !post.threadHasAuthorIds
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
				country: post.authorIconId,
				name: post.authorIconName
			}
		},
		title: (post, locale) => post.authorCountry ? getCountryNames(locale)[post.authorCountry] : post.authorIconName,
		condition: post => post.authorCountry || post.authorIconName
	},
	{
		name: 'bump-limit',
		icon: SinkingBoatIcon,
		title: (post, locale) => getMessages(locale).post.bumpLimitReached,
		// On `2ch.hk` there can be "rolling" threads which aren't "sticky".
		condition: (post, thread) => post.isBumpLimitReached && !post.isSticky && !post.isRolling
	},
	{
		name: 'sticky',
		icon: PinIcon,
		title: (post, locale) => getMessages(locale).post.sticky,
		condition: (post, thread) => post.isSticky
	},
	{
		name: 'rolling',
		icon: InfinityIcon,
		title: (post, locale) => getMessages(locale).post.rolling,
		condition: (post, thread) => post.isRolling
	},
	{
		name: 'closed',
		icon: LockIcon,
		title: (post, locale) => getMessages(locale).post.closed,
		condition: (post, thread) => post.isLocked
	}
]

const FOOTER_BADGES = [
	CommentsCountBadge,
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
	}
]

function getRoleName(authorRole, post, locale) {
	if (post.authorRoleJurisdiction) {
		const roleNames = getMessages(locale).role[post.authorRoleJurisdiction]
		if (roleNames && roleNames[authorRole]) {
			return roleNames[authorRole]
		}
	}
	return getMessages(locale).role[authorRole]
}

function HiddenPostComponent({ post, locale }) {
	let content = getMessages(locale).hiddenPost
	if (post.hiddenRule) {
		content += ` (${post.hiddenRule})`
	}
	return (
		<ContentSection className="thread__comment thread__comment--hidden">
			{content}
		</ContentSection>
	)
}

HiddenPostComponent.propTypes = {
	post: post.isRequired,
	locale: PropTypes.string
}