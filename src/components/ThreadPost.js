import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Post from 'webapp-frontend/src/components/Post'
import OnClick from 'webapp-frontend/src/components/OnClick'

import {
	ContentSection,
	ContentSectionHeader
} from 'webapp-frontend/src/components/ContentSection'

import './ThreadPost.css'

export default class ThreadPost extends React.Component {
	state = {
		hidden: this.props.post.hidden
	}

	onClick = () => {
		const { thread, post, onClick } = this.props
		const { hidden } = this.state
		if (hidden) {
			return this.setState({ hidden: false })
		}
		onClick(post, thread)
	}

	render() {
		const { thread, post } = this.props
		const { hidden } = this.state

		if (!post) {
			return null
		}

		return (
			<OnClick
				id={post.id}
				filter={postOnClickFilter}
				onClick={this.onClick}
				onClickClassName="thread__post-container--click"
				className="thread__post-container">
				<ContentSection
					className={classNames('thread__post', {
						'thread__post--hidden': hidden,
						'thread__post--with-subject': post.subject
					})}>
					{hidden && 'Сообщение скрыто'}
					{!hidden && post.subject &&
						<ContentSectionHeader>
							{post.subject}
						</ContentSectionHeader>
					}
					{!hidden &&
						<Post
							post={post}
							url={`https://2ch.hk/${thread.board}/res/${thread.id}.html#${post.id}`}
							saveBandwidth
							expandFirstPictureOrVideo={false}
							attachmentThumbnailHeight={160} />
					}
				</ContentSection>
			</OnClick>
		)
	}
}

ThreadPost.propTypes = {
	onClick: PropTypes.func.isRequired,
	post: PropTypes.shape({
		id: PropTypes.string.isRequired
	}),
	thread: PropTypes.shape({
		id: PropTypes.string.isRequired,
		board: PropTypes.string.isRequired
	})
}

export function postOnClickFilter(element) {
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