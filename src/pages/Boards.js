import React from 'react'
import { meta, preload, Link } from 'react-website'
import { connect } from 'react-redux'
import VirtualScroller from 'virtual-scroller/react'

import { Boards } from '../components/Boards'
import BoardUrl from '../components/BoardUrl'
import { getBoards } from '../redux/chan'
import getUrl from '../utility/getUrl'

import getMessages from '../messages'

import './Boards.css'

@meta(({ settings }) => ({
	title: getMessages(settings.settings.locale).boards.title
}))
@preload(({ dispatch }) => dispatch(getBoards({ all: true })))
@connect(({ settings, chan }) => ({
	locale: settings.settings.locale,
	boards: chan.allBoards.boards,
	boardsByCategory: chan.allBoards.boardsByCategory,
	boardsByPopularity: chan.allBoards.boardsByPopularity
}))
export default class BoardsPage_ extends React.Component {
	render() {
		return <BoardsPage {...this.props}/>
	}
}

function BoardsPage({
	locale,
	boards,
	boardsByCategory,
	boardsByPopularity
}) {
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
			<BoardUrl boardId={board.id} className="boards-list__board-url"/>
			<div className="boards-list__board-name">
				{board.title}
			</div>
		</Link>
	)
}

BoardsListItem.propTypes = {
	children: PropTypes.object.isRequired
}

// Using `React.memo()` so that `virtual-scroller`
// doesn't re-render items as the user scrolls.
BoardsListItem = React.memo(BoardsListItem)