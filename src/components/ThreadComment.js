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

import { getChan, addChanParameter } from '../chan'
import getMessages from '../messages'
import getBasePath from '../utility/getBasePath'
import configuration from '../configuration'

import './ThreadComment.css'

@connect(({ account }) => ({
	locale: account.settings.locale
}))
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
			locale
		} = this.props

		const { hidden } = this.state

		// `4chan.org` displays attachment thumbnails as `125px`
		// (half the size) when they're not "OP posts".
		const commentElement = (
			<Comment
				compact={mode === 'thread'}
				comment={comment}
				hidden={hidden}
				url={addChanParameter(getUrl(board, thread, comment))}
				locale={locale}
				halfSizedAttachmentThumbnails={getChan().id === '4chan' && comment.id !== thread.id}/>
		)

		if (hidden || onClick) {
			return (
				<OnClick
					id={`comment-${comment.id}`}
					filter={commentOnClickFilter}
					onClick={hidden || onClick ? this.onClick : undefined}
					link={hidden || onClick ? (getBasePath() || '') + addChanParameter(getUrl(board, thread, comment)) : undefined}
					onClickClassName="thread__comment-container--click"
					className="thread__comment-container">
					{commentElement}
				</OnClick>
			)
		}

		return (
			<div
				id={`comment-${comment.id}`}
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
	comment: PropTypes.object.isRequired
}

function Comment({ halfSizedAttachmentThumbnails, comment, compact, hidden, url, locale }) {
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
			url={url}
			locale={locale}
			compact={compact}
			saveBandwidth
			serviceIcons={SERVICE_ICONS}
			youTubeApiKey={configuration.youTubeApiKey}
			expandFirstPictureOrVideo={false}
			attachmentThumbnailSize={halfSizedAttachmentThumbnails ? getChan().thumbnailSize / 2 : getChan().thumbnailSize}
			className="thread__comment content-section" />
	);
}

Comment.propTypes = {
	comment: PropTypes.object.isRequired,
	hidden: PropTypes.bool,
	url: PropTypes.string.isRequired,
	locale: PropTypes.string,
	halfSizedAttachmentThumbnails: PropTypes.bool
}

export function commentOnClickFilter(element) {
	const tagName = element.tagName.toLowerCase()
	switch (tagName) {
		case 'img':
		case 'time':
		case 'a':
		case 'button':
			return false
	}
	if (element.classList.contains('post__inline-spoiler-contents')) {
		return false
	}
	return true
}

const SERVICE_ICONS = {
	'arhivach': ArhivachIcon,
	'2ch': getChan('2ch').logo,
	'4chan': getChan('4chan').logo
}