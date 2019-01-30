import React from 'react'
import { preload, meta } from 'react-website'
import { connect } from 'react-redux'
import classNames from 'classnames'

import { getPosts } from '../redux/chan'

import Boards from '../components/Boards'
import ThreadPost from '../components/ThreadPost'

import './Thread.css'

@meta((state) => ({
	title: state.chan.thread && (state.chan.thread.posts[0].subject || state.chan.board.name)
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
						<Boards/>
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

// Opens external link in a new tab.
function openExternalLink(url) {
	const link = document.createElement('a')
	link.setAttribute('href', url)
	link.setAttribute('target', '_blank')
	link.click()
}