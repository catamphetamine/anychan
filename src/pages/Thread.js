import React from 'react'
import { preload, meta } from 'react-website'
import { connect } from 'react-redux'
import classNames from 'classnames'

import { getComments } from '../redux/chan'

import Boards from '../components/Boards'
import ThreadComment from '../components/ThreadComment'

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
	await dispatch(getComments(params.board, params.thread, getState().account.settings.filters))
})
export default class ThreadPage extends React.Component {
	onCommentClick = (comment, thread, board) => {
		openExternalLink(`https://2ch.hk/${board.id}/res/${thread.id}.html#${comment.id}`)
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
								onClick={this.onCommentClick}/>
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