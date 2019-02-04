import React from 'react'
import PropTypes from 'prop-types'
import { goto, preload, meta } from 'react-website'
import { connect } from 'react-redux'
import classNames from 'classnames'

import { notify } from 'webapp-frontend/src/redux/notifications'
import { getThreads } from '../redux/chan'
import { addChanParameter } from '../chan'
import getMessages from '../messages'

import Boards from '../components/Boards'
import ThreadComment from '../components/ThreadComment'

import './Board.css'

@meta((state) => ({
	title       : state.chan.board && state.chan.board.name,
	description : state.chan.board && state.chan.board.description
}))
@connect(({ account, chan }) => ({
	board: chan.board,
	threads: chan.threads,
	locale: account.settings.locale
}), {
	goto,
	notify
})
@preload(async ({ getState, dispatch, params }) => {
	await dispatch(getThreads(
		params.board,
		getState().account.settings.filters,
		getState().account.settings.locale
	))
})
export default class BoardPage extends React.Component {
	onThreadClick = (comment, thread, board) => {
		const { goto, notify, locale } = this.props
		try {
			// Won't ever throw because `goto()` doesn't return a `Promise`.
			goto(addChanParameter(this.getUrl(board, thread, comment), { instantBack: true }))
		} catch (error) {
			notify(getMessages(locale).loadingCommentsError, { type: 'error '})
		}
	}
	getUrl = (board, thread, comment) => {
		return `/${board.id}/${thread.id}#${comment.id}`
	}
	render() {
		const { board, threads } = this.props
		return (
			<section className="container">
				<div className="row row--align-top">
					<div className="col-3 col-xs-12">
						<Boards/>
					</div>
					<div className="col-9 col-xs-12 col--padding-left-xs">
						{threads && threads.map((thread) => (
							<ThreadComment
								key={thread.comments[0].id}
								board={board}
								thread={thread}
								comment={thread.comments[0]}
								onClick={this.onThreadClick}
								getUrl={this.getUrl}/>
						))}
					</div>
				</div>
			</section>
		)
	}
}