import React from 'react'
import { preload, meta } from 'react-website'
import { connect } from 'react-redux'
import classNames from 'classnames'

import { getComments } from '../redux/chan'

import ThreadComment from '../components/ThreadComment'

import openLinkInNewTab from 'webapp-frontend/src/utility/openLinkInNewTab'

import './Thread.css'

@meta(({ chan: { board, thread }}) => ({
	title: thread && (thread.comments[0].heading || board.name),
	description: thread && thread.comments[0].textPreview,
	image: thread && getThreadImage(thread)
}))
@connect(({ chan }) => ({
	board: chan.board,
	thread: chan.thread,
	comments: chan.comments
}))
@preload(async ({ getState, dispatch, params }) => {
	// Must be the same as the code inside `onThreadClick` in `pages/Board.js`.
	await dispatch(getComments(
		params.board,
		params.thread,
		getState().account.settings.filters,
		getState().account.settings.locale
	))
})
export default class ThreadPage extends React.Component {
	getUrl = (board, thread, comment) => {
		return `/${board.id}/${thread.id}#comment-${comment.id}`
	}
	render() {
		const {
			board,
			thread,
			comments
		} = this.props
		return (
			<section className="content content--posts">
				{comments && comments.map((comment) => (
					<ThreadComment
						key={comment.id}
						board={board}
						thread={thread}
						comment={comment}
						getUrl={this.getUrl}/>
				))}
			</section>
		)
	}
}

function getThreadImage(thread) {
	const comment = thread.comments[0]
	if (comment.attachments.length > 0) {
		const attachment = comment.attachments[0]
		switch (attachment.type) {
			case 'picture':
				return attachment.picture.sizes[0].url
			case 'video':
				return attachment.video.picture.sizes[0].url
		}
	}
}