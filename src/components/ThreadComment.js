import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { post } from '../PropTypes'

import ArhivachIcon from '../../assets/images/icons/services/arhivach.svg'

import PostForm from './PostForm'
import Header, { HEADER_BADGES } from './ThreadCommentHeader'
import { getFooterBadges } from './ThreadCommentFooter'
import ThreadCommentHidden from './ThreadCommentHidden'

import Post from 'webapp-frontend/src/components/Post'
import OnClick from 'webapp-frontend/src/components/OnClick'

import { getChan } from '../chan'
import getMessages from '../messages'
import getBasePath from '../utility/getBasePath'
import getUrl from '../utility/getUrl'
import configuration from '../configuration'

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

	onAttachmentClick = (attachment, i, attachments) => {
		const { openSlideshow } = this.props
		openSlideshow(attachments, i)
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
			notify,
			parentComment,
			showingReplies,
			onToggleShowReplies,
			toggleShowRepliesButtonRef,
			initialExpandContent,
			onExpandContent,
			onContentDidChange,
			onCommentContentChange,
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
				hidden={hidden}
				url={getUrl(board, thread, comment)}
				locale={locale}
				onAttachmentClick={this.onAttachmentClick}
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
				onCommentContentChange={onCommentContentChange}
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
	onCommentContentChange: PropTypes.func,
	postRef: PropTypes.any
}

function Comment({
	comment,
	hidden,
	showingReplies,
	onToggleShowReplies,
	toggleShowRepliesButtonRef,
	onCommentContentChange,
	parentComment,
	postRef,
	notify,
	locale,
	className,
	...rest
}) {
	if (hidden) {
		return (
			<ThreadCommentHidden
				post={comment}
				locale={locale}
				className="thread__comment thread__comment--hidden"/>
		)
	}
	let attachmentThumbnailSize = getChan().thumbnailSize
	// `4chan.org` displays attachment thumbnails as `125px`
	// (half the size) when they're not "OP posts".
	if (getChan().id === '4chan' && !comment.isRootComment) {
		attachmentThumbnailSize /= 2
	}
	// `2ch.hk` thumbnails on `/b/` are low-quality anyway.
	// // `2ch.hk` creates bigger thumbnails for `/b/` for some reason.
	// if (getChan().id === '2ch' && boardId === 'b') {
	// 	attachmentThumbnailSize *= 1.1
	// }
	return (
		<Post
			{...rest}
			ref={postRef}
			post={comment}
			header={Header}
			locale={locale}
			genericMessages={getMessages(locale)}
			messages={getMessages(locale).post}
			onMoreActions={() => notify('Not implemented yet')}
			onPostContentChange={onCommentContentChange}
			headerBadges={HEADER_BADGES}
			footerBadges={getFooterBadges(comment, {
				parentComment,
				showingReplies,
				onToggleShowReplies,
				toggleShowRepliesButtonRef
			})}
			useSmallestThumbnailsForAttachments
			serviceIcons={SERVICE_ICONS}
			youTubeApiKey={configuration.youtube && configuration.youtube.apiKey}
			expandFirstPictureOrVideo={false}
			maxAttachmentThumbnails={false}
			attachmentThumbnailSize={attachmentThumbnailSize}
			commentLengthLimit={configuration.commentLengthLimit}
			fixAttachmentThumbnailSizes={getChan().id === 'kohlchan' && comment.attachments ? true : false}
			className={classNames(className, 'thread__comment', 'content-section')} />
	)
}

Comment.propTypes = {
	comment: post.isRequired,
	hidden: PropTypes.bool,
	locale: PropTypes.string.isRequired,
	parentComment: post,
	showingReplies: PropTypes.bool,
	onToggleShowReplies: PropTypes.func,
	toggleShowRepliesButtonRef: PropTypes.any,
	postRef: PropTypes.any,
	onCommentContentChange: PropTypes.func,
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