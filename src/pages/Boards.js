import React from 'react'
import { meta, preload } from 'react-website'
import { connect } from 'react-redux'

import { Boards } from '../components/Boards'
import { getAllBoards } from '../redux/chan'

import getMessages from '../messages'

import './Boards.css'

@meta(({ app }) => ({
	title: getMessages(app.settings.locale).boardsList
}))
@preload(({ dispatch }) => dispatch(getAllBoards()))
@connect(({ app, chan }) => ({
	locale: app.settings.locale,
	boards: chan.allBoards.boards,
	boardsByCategory: chan.allBoards.boardsByCategory,
	boardsByPopularity: chan.allBoards.boardsByPopularity
}))
export default class BoardsPage extends React.Component {
	render() {
		const {
			locale,
			boards,
			boardsByCategory,
			boardsByPopularity
		} = this.props
		return (
			<section className="content text-content">
				<Boards
					locale={locale}
					boards={boards}
					boardsByPopularity={boardsByPopularity}
					boardsByCategory={boardsByCategory}
					showAllBoards/>
			</section>
		)
	}
}