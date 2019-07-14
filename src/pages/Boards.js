import React from 'react'
import { meta, preload, Link } from 'react-website'
import { connect } from 'react-redux'
import VirtualScroller from 'virtual-scroller/react'

import { Boards } from '../components/Boards'
import { getAllBoards } from '../redux/chan'
import getUrl from '../utility/getUrl'

import getMessages from '../messages'

import './Boards.css'

@meta(({ app }) => ({
	title: getMessages(app.settings.locale).boards.title
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
			<section className="boards-page content text-content">
				<Boards
					locale={locale}
					boards={boards}
					boardsByPopularity={boardsByPopularity}
					boardsByCategory={boardsByCategory}
					listComponent={BoardsList}
					showAllBoards/>
			</section>
		)
	}
}

function BoardsList({ className, children }) {
	// On `8ch.net` there're about 20 000 user-created boards.
	// Such a long list would render very slowly without virtualization.
	return (
		<VirtualScroller
			items={children}
			itemComponent={BoardsListItem}
			className={className}/>
	)
}

BoardsList.propTypes = {
	className: PropTypes.string,
	children: PropTypes.arrayOf(PropTypes.shape({
		key: PropTypes.string.isRequired,
		board: PropTypes.object
	})).isRequired
}

function BoardsListItem({ children: { board } }) {
	return (
		<Link
			to={getUrl(board)}
			className="boards-list__item">
			<div className="boards-list__board-url">
				{board.id}
			</div>
			<div className="boards-list__board-name">
				{board.name}
			</div>
		</Link>
	)
}

BoardsListItem.propTypes = {
	children: PropTypes.object.isRequired
}