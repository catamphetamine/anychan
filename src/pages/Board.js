import React from 'react'
import { preload, meta } from 'react-website'
import { connect } from 'react-redux'

import { selectBoard, getThreads } from '../redux/chan'
import { preloadStarted, preloadFinished } from 'webapp-frontend/src/redux/preload'

import Boards from '../components/Boards'
import Threads from '../components/Threads'

import {
	ContentSection
} from 'webapp-frontend/src/components/ContentSection'

import './Board.css'

@meta((state) => ({
	title       : state.chan.board && state.chan.board.name,
	description : state.chan.board && state.chan.board.description
}))
@connect(({ chan }) => ({
	board: chan.board
}))
@preload(async ({ getState, dispatch, params }) => {
	dispatch(selectBoard(params.id))
	dispatch(preloadStarted())
	try {
		await dispatch(getThreads(params.id))
	} finally {
		dispatch(preloadFinished())
	}
})
export default class BoardPage extends React.Component {
	render() {
		return (
			<section className="container">
				<div className="row">
					<ContentSection className="col-3">
						<Boards onBoardClick={this.onBoardClick}/>
					</ContentSection>
					<div className="col-9">
						<Threads/>
					</div>
				</div>
			</section>
		)
	}
}

