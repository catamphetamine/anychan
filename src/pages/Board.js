import React from 'react'
import PropTypes from 'prop-types'
import { goto, pushLocation, preload, meta } from 'react-website'
import { connect } from 'react-redux'
import classNames from 'classnames'

import { getThreads, getComments } from '../redux/chan'
import { notify } from 'webapp-frontend/src/redux/notifications'
import { preloadStarted, preloadFinished } from 'webapp-frontend/src/redux/preload'

import { addChanParameter } from '../chan'
import getMessages from '../messages'

import ThreadComment from '../components/ThreadComment'

import './Board.css'

@meta(({ chan: { board }}) => ({
	title: board && board.name,
	description: board && board.description
}))
@connect(({ account, chan }) => ({
	board: chan.board,
	threads: chan.threads,
	settings: account.settings
}), {
	preloadStarted,
	preloadFinished,
	getComments,
	pushLocation,
	goto,
	notify
})
@preload(async ({ getState, dispatch, params }) => {
	// Must be the same as the code inside `onBoardClick` in `components/Boards.js`.
	await dispatch(getThreads(
		params.board,
		getState().account.settings.filters,
		getState().account.settings.locale
	))
})
export default class BoardPage extends React.Component {
	constructor() {
		super()
		this.onThreadClick = this.onThreadClick.bind(this)
	}

	async onThreadClick(comment, thread, board) {
		const {
			preloadStarted,
			preloadFinished,
			getComments,
			pushLocation,
			notify,
			settings
		} = this.props
		try {
			preloadStarted()
			// Must be the same as the code inside `@preload()` in `pages/Thread.js`.
			await getComments(
				board.id,
				thread.id,
				settings.filters,
				settings.locale
			)
			// Won't ever throw because `goto()` doesn't return a `Promise`.
			pushLocation(addChanParameter(this.getUrl(board, thread, comment)), { instantBack: true })
		} catch (error) {
			notify(getMessages(settings.locale).loadingCommentsError, { type: 'error '})
		} finally {
			preloadFinished()
		}
	}
	getUrl = (board, thread, comment) => {
		return `/${board.id}/${thread.id}`
	}
	render() {
		const {
			board,
			threads
		} = this.props
		return (
			<section className="board-page content content--posts">
				<h1 className="board-page__title">
					{board.name}
				</h1>
				<div className="board-page__threads">
					{threads && threads.map((thread) => (
						<ThreadComment
							key={thread.comments[0].id}
							board={board}
							thread={thread}
							comment={thread.comments[0]}
							getUrl={this.getUrl}
							onClick={this.onThreadClick}/>
					))}
				</div>
			</section>
		)
	}
}