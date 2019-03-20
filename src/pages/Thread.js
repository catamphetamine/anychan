import React from 'react'
import PropTypes from 'prop-types'
import { preload, meta, Link } from 'react-website'
import { connect } from 'react-redux'
import classNames from 'classnames'

import getUrl from '../utility/getUrl'
import { getThread } from '../redux/chan'
import { notify } from 'webapp-frontend/src/redux/notifications'
import { openSlideshow } from 'webapp-frontend/src/redux/slideshow'

import ThreadComment from '../components/ThreadComment'

import openLinkInNewTab from 'webapp-frontend/src/utility/openLinkInNewTab'

import './Thread.css'

@meta(({ chan: { board, thread }}) => ({
	title: thread && thread.subject || board && board.name,
	description: thread && thread.comments[0].textPreview,
	image: thread && getThreadImage(thread)
}))
@connect(({ chan, app }) => ({
	board: chan.board,
	thread: chan.thread,
	locale: app.settings.locale
}), {
	openSlideshow,
	notify
})
@preload(async ({ getState, dispatch, params }) => {
	// Must be the same as the code inside `onThreadClick` in `pages/Board.js`.
	await dispatch(getThread(
		params.board,
		params.thread,
		getState().app.settings.filters,
		getState().app.settings.locale
	))
})
export default class ThreadPage extends React.Component {
	static propTypes = {
		openSlideshow: PropTypes.func.isRequired,
		notify: PropTypes.func.isRequired,
		locale: PropTypes.string.isRequired
	}

	render() {
		const {
			board,
			thread,
			locale,
			openSlideshow,
			notify
		} = this.props

		return (
			<section className={classNames('thread-page', 'content', 'text-content')}>
				<header className="thread-page__header page__heading">
					<div className="page__heading-text">
						<Link to={getUrl(board)}>
							{board.name}
						</Link>
					</div>
					<h1 className="page__heading-text">
						{thread.subject}
					</h1>
				</header>
				{thread.comments.map((comment) => (
					<ThreadComment
						key={comment.id}
						mode="thread"
						board={board}
						thread={thread}
						comment={comment}
						getUrl={getUrl}
						locale={locale}
						openSlideshow={openSlideshow}
						notify={notify}/>
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