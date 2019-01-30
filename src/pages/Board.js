import React from 'react'
import PropTypes from 'prop-types'
import { goto, preload, meta } from 'react-website'
import { connect } from 'react-redux'
import classNames from 'classnames'

import { getThreads } from '../redux/chan'

import Boards from '../components/Boards'
import ThreadPost from '../components/ThreadPost'

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
	onPostClick = (post, thread) => {
		const { goto } = this.props
		goto(`/${thread.board}/${thread.id}`, { instantBack: true })
	}
	render() {
		const { threads } = this.props
		return (
			<section className="container">
				<div className="row row--align-top">
					<div className="col-3 col-xs-12">
						<Boards/>
					</div>
					<div className="col-9 col-xs-12 col--padding-left-xs">
						{threads && threads.map((thread) => (
							<ThreadPost
								key={thread.posts[0].id}
								thread={thread}
								post={thread.posts[0]}
								onClick={this.onPostClick}/>
						))}
					</div>
				</div>
			</section>
		)
	}
}