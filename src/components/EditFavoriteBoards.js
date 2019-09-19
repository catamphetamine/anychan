import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import ListButton from './ListButton'

import { board } from '../PropTypes'
import getMessages from '../messages'
import { removeFavoriteBoard } from '../redux/favoriteBoards'

import DeleteIcon from 'webapp-frontend/assets/images/icons/close-thicker.svg'

import './Boards.css'
import './EditFavoriteBoards.css'

@connect(({ found, app, threadTracker, chan }) => ({
	locale: app.settings.locale
}), dispatch => ({ dispatch }))
export default class EditFavoriteBoards_ extends React.Component {
	render() {
		return <EditFavoriteBoards {...this.props}/>
	}
}

function EditFavoriteBoards({ boards, locale, dispatch }) {
	return (
		<section className="boards-list boards-list--grid">
			{boards.map((board) => (
				<Board
					key={board.id}
					board={board}
					locale={locale}
					dispatch={dispatch}/>
			))}
		</section>
	)
}

EditFavoriteBoards.propTypes = {
	boards: PropTypes.arrayOf(board).isRequired
}

function Board({ board, locale, dispatch }) {
	const onRemoveFavoriteBoard = useCallback(() => dispatch(removeFavoriteBoard(board)), [board])
	return (
		<React.Fragment>
			<div className="boards-list__board-url">
				{board.id}
			</div>
			<div className="boards-list__board-name">
				{board.title}
				<ListButton
					muted
					icon="remove"
					onClick={onRemoveFavoriteBoard}
					title={getMessages(locale).actions.remove}
					className="edit-favorite-boards__remove"/>
			</div>
		</React.Fragment>
	)
}

Board.propTypes = {
	board: board.isRequired,
	locale: PropTypes.string.isRequired,
	dispatch: PropTypes.func.isRequired
}