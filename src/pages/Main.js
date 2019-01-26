import React from 'react'
import { preload, meta } from 'react-website'
import { connect } from 'react-redux'

import { getBoards, selectBoard, getThreads } from '../redux/chan'

import { preloadStarted, preloadFinished } from 'webapp-frontend/src/redux/preload'

import Boards from '../components/Boards'
import Threads from '../components/Threads'

import {
	ContentSection,
	ContentSectionHeader
} from 'webapp-frontend/src/components/ContentSection'

import './Main.css'

@connect(({ chan }) => ({
	board: chan.board
}), {
	selectBoard,
	getThreads,
	preloadStarted,
	preloadFinished
})
@preload(({ dispatch }) => dispatch(getBoards()))
export default class MainPage extends React.Component {
	onBoardClick = (id) => {
		const {
			selectBoard,
			getThreads,
			preloadStarted,
			preloadFinished
		} = this.props

		selectBoard(id)
		preloadStarted()
		getThreads(id).then(preloadFinished, preloadFinished)
	}

	render() {
		const { selectBoard } = this.props
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

