import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Post from 'webapp-frontend/src/components/Post'
import OnClick from 'webapp-frontend/src/components/OnClick'

import {
	ContentSection,
	ContentSectionHeader
} from 'webapp-frontend/src/components/ContentSection'

import './ThreadComment.css'

export default class ThreadComment extends React.Component {
	state = {
		hidden: this.props.comment.hidden
	}

	onClick = () => {
		const { board, thread, comment, onClick } = this.props
		const { hidden } = this.state
		if (hidden) {
			return this.setState({ hidden: false })
		}
		onClick(comment, thread, board)
	}

	render() {
		const { board, thread, comment } = this.props
		const { hidden } = this.state

		return (
			<OnClick
				id={comment.id}
				filter={commentOnClickFilter}
				onClick={this.onClick}
				onClickClassName="thread__comment-container--click"
				className="thread__comment-container">
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
							url={`https://2ch.hk/${board.id}/res/${thread.id}.html#${comment.id}`}
							saveBandwidth
							expandFirstPictureOrVideo={false}
							attachmentThumbnailHeight={160} />
					}
				</ContentSection>
			</OnClick>
		)
	}
}

ThreadComment.propTypes = {
	onClick: PropTypes.func.isRequired,
	board: PropTypes.shape({
		id: PropTypes.string.isRequired
	}),
	thread: PropTypes.shape({
		id: PropTypes.string.isRequired
	}),
	comment: PropTypes.shape({
		id: PropTypes.string.isRequired
	})
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