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
@connect(({ chan }) => ({
	board: chan.board,
	threads: chan.threads
}), {
	goto
})
@preload(async ({ getState, dispatch, params }) => {
	try {
		await dispatch(getThreads(
			params.board,
			getState().account.settings.filters,
			getState().account.settings.locale
		))
	} catch (error) {
		dispatch(notify(getMessages(getState().account.settings.locale).loadingThreadsError, { type: 'error '}))
		dispatch(goto(addChanParameter('/')))
	}
})
export default class BoardPage extends React.Component {
	onPostClick = (comment, thread, board) => {
		const { goto } = this.props
		goto(addChanParameter(this.getUrl(board, thread, comment), { instantBack: true }))
	}
	getUrl = (board, thread, comment) => {
		return `/${board.id}/${thread.id}`
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
								onClick={this.onPostClick}
								getUrl={this.getUrl}/>
						))}
					</div>
				</div>
			</section>
		)
	}
}