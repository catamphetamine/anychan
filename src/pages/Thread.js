import React from 'react'
import { preload, meta } from 'react-website'
import { connect } from 'react-redux'
import classNames from 'classnames'

import { getPosts } from '../redux/chan'

import Boards from '../components/Boards'

import Post from 'webapp-frontend/src/components/Post'
import OnClick from 'webapp-frontend/src/components/OnClick'

import {
	ContentSection,
	ContentSectionHeader
} from 'webapp-frontend/src/components/ContentSection'

import './Thread.css'

@meta((state) => ({
	title: state.chan.thread && state.chan.thread.posts[0].subject
}))
@connect(({ chan }) => ({
	thread: chan.thread,
	posts: chan.posts
}))
@preload(async ({ getState, dispatch, params }) => {
	await dispatch(getPosts(params.board, params.thread, getState().account.settings.filters))
})
export default class ThreadPage extends React.Component {
	onPostClick = (post, thread) => {
		openExternalLink(`https://2ch.hk/${thread.board}/res/${thread.id}.html#${post.id}`)
	}
	render() {
		const { thread, posts } = this.props
		return (
			<section className="container">
				<div className="row row--align-top">
					<div className="col-3 col-xs-12">
						<ContentSection>
							<Boards/>
						</ContentSection>
					</div>
					<div className="col-9 col-xs-12 col--padding-left-xs">
						{posts && posts.map((post) => (
							<ThreadPost
								key={post.id}
								thread={thread}
								post={post}
								onClick={this.onPostClick}/>
						))}
					</div>
				</div>
			</section>
		)
	}
}

export class ThreadPost extends React.Component {
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
		const { post } = this.props
		const { hidden } = this.state

		if (!post) {
			return null
		}

		return (
			<OnClick
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

// Opens external link in a new tab.
function openExternalLink(url) {
	const link = document.createElement('a')
	link.setAttribute('href', url)
	link.setAttribute('target', '_blank')
	link.click()
}