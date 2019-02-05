import React from 'react'
import { preload, meta } from 'react-website'
import { connect } from 'react-redux'
import classNames from 'classnames'

import { getComments } from '../redux/chan'

import Boards from '../components/Boards'
import ThreadComment from '../components/ThreadComment'

import openLinkInNewTab from 'webapp-frontend/src/utility/openLinkInNewTab'

import './Thread.css'

@meta((state) => ({
	title: state.chan.thread && (state.chan.thread.comments[0].subject || state.chan.board.name)
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
			<section className="container">
				<div className="row row--align-top">
					<div className="col-3 col-xs-12">
						<Boards/>
					</div>
					<div className="col-9 col-xs-12 col--padding-left-xs">
						{comments && comments.map((comment) => (
							<ThreadComment
								key={comment.id}
								board={board}
								thread={thread}
								comment={comment}
								getUrl={this.getUrl}/>
						))}
					</div>
				</div>
			</section>
		)
	}
}