import React from 'react'
import PropTypes from 'prop-types'
import { goto, preload, meta } from 'react-website'
import { connect } from 'react-redux'
import classNames from 'classnames'

import { getThreads } from '../redux/chan'

import Boards from '../components/Boards'
import ThreadComment from '../components/ThreadComment'

import './Board.css'

@meta((state) => ({
	title       : state.chan.board && state.chan.board.name,
	description : state.chan.board && state.chan.board.description
}))
@connect(({ chan }) => ({
	board: chan.board,
	threads: chan.threads,
	page: chan.threadsPage,
	pagesCount: chan.threadsPagesCount
}), {
	goto
})
@preload(async ({ getState, dispatch, params }) => {
	await dispatch(getThreads(params.board, 1, getState().account.settings.filters))
})
export default class BoardPage extends React.Component {
	onPostClick = (comment, thread, board) => {
		const { goto } = this.props
		goto(this.getUrl(board, thread, comment), { instantBack: true })
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