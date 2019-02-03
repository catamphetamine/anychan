import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Post from 'webapp-frontend/src/components/Post'
import OnClick from 'webapp-frontend/src/components/OnClick'

import {
	ContentSection,
	ContentSectionHeader
} from 'webapp-frontend/src/components/ContentSection'

import { getChan } from '../chan'

import './ThreadComment.css'

export default class ThreadComment extends React.Component {
	state = {
		hidden: this.props.comment.hidden
	}

	toggleShowHide = () => {
		this.setState(({ hidden }) => ({
			hidden: !hidden
		}))
	}

	onClick = () => {
		const { board, thread, comment, onClick } = this.props
		const { hidden } = this.state
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
			comment
		} = this.props

		const { hidden } = this.state

		const commentElement = (
			<Comment
				comment={comment}
				hidden={hidden}
				url={getUrl(board, thread, comment)}/>
		)

		if (hidden || onClick) {
			return (
				<OnClick
					id={`comment-${comment.id}`}
					filter={commentOnClickFilter}
					onClick={hidden || onClick ? this.onClick : undefined}
					link={hidden || onClick ? getUrl(board, thread, comment) : undefined}
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

function Comment({ comment, hidden, url }) {
	return (
		<ContentSection
			className={classNames('thread__comment', {
				'thread__comment--hidden': hidden,
				'thread__comment--with-subject': comment.subject
			})}>
			{hidden && 'Сообщение скрыто'}
			{!hidden && comment.subject &&
				<ContentSectionHeader>
					{comment.subject}
				</ContentSectionHeader>
			}
			{!hidden &&
				<Post
					post={comment}
					url={url}
					saveBandwidth
					expandFirstPictureOrVideo={false}
					attachmentThumbnailHeight={160} />
			}
		</ContentSection>
	)
}

Comment.propTypes = {
	comment: PropTypes.object.isRequired,
	hidden: PropTypes.bool,
	url: PropTypes.string.isRequired,
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