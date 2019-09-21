import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Autocomplete } from 'react-responsive-ui'

import ListButton from './ListButton'
import BoardUrl from './BoardUrl'

import { board } from '../PropTypes'
import getMessages from '../messages'
import { removeFavoriteBoard, addFavoriteBoard } from '../redux/favoriteBoards'

import SearchIcon from 'webapp-frontend/assets/images/icons/menu/search-outline.svg'

import './Boards.css'
import './EditFavoriteBoards.css'

@connect(({ app, chan, favoriteBoards }) => ({
	favoriteBoards: favoriteBoards.favoriteBoards,
	allBoards: chan.allBoards && chan.allBoards.boards,
	locale: app.settings.locale
}), dispatch => ({ dispatch }))
export default class EditFavoriteBoards_ extends React.Component {
	render() {
		return <EditFavoriteBoards {...this.props}/>
	}
}

function EditFavoriteBoards({
	favoriteBoards,
	allBoards,
	locale,
	dispatch
}) {
	const [selectedBoard, setSelectedBoard] = useState()
	const onSelectBoard = useCallback((board) => {
		// Set a new "selected board" with empty `value` and `label`
		// so that the input field is empty again.
		setSelectedBoard({})
		// Add the board to the list of "favorite boards".
		dispatch(addFavoriteBoard(board))
	}, [dispatch])
	return (
		<section className="edit-favorite-boards">
			<Autocomplete
				autoFocus
				autoComplete="off"
				maxOptions={50}
				optionComponent={BoardOptionComponent}
				icon={SearchIcon}
				className="edit-favorite-boards__search"
				value={selectedBoard}
				onChange={onSelectBoard}
				options={allBoards
					.filter(_ => !favoriteBoards.find(board => board.id === _.id))
					.map((board) => ({
						value: board,
						// `board.title` can be `undefined` on some `8ch.net` userboards.
						label: `/${board.id}/ ${board.title || ''}`
					}))}/>
			<table className="edit-favorite-boards__list">
				<tbody>
					{favoriteBoards.map((board) => (
						<Board
							key={board.id}
							board={board}
							locale={locale}
							dispatch={dispatch}/>
					))}
				</tbody>
			</table>
		</section>
	)
}

EditFavoriteBoards.propTypes = {
	favoriteBoards: PropTypes.arrayOf(board).isRequired,
	allBoards: PropTypes.arrayOf(board).isRequired,
	locale: PropTypes.string.isRequired,
	dispatch: PropTypes.func.isRequired
}

function Board({ board, locale, dispatch }) {
	const onRemoveFavoriteBoard = useCallback(async () => {
		await dispatch(removeFavoriteBoard(board))
	}, [dispatch, board])
	return (
		<tr>
			<td></td>
			<td className="edit-favorite-boards__board-url-column">
				<BoardUrl
					boardId={board.id}
					className="boards-list__board-url"/>
			</td>
			<td>
				<span className="boards-list__board-name">
					{board.title}
					<ListButton
						muted
						icon="remove"
						onClick={onRemoveFavoriteBoard}
						title={getMessages(locale).actions.remove}
						className="edit-favorite-boards__remove"/>
				</span>
			</td>
			<td></td>
		</tr>
	)
}

Board.propTypes = {
	board: board.isRequired,
	locale: PropTypes.string.isRequired,
	dispatch: PropTypes.func.isRequired
}

function BoardOptionComponent({
	value,
	label,
	selected,
	focused
}) {
	return (
		<span className="edit-favorite-boards__search__option rrui__text-line">
			<BoardUrl boardId={value.id}/> {value.title}
		</span>
	)
}

BoardOptionComponent.propTypes = {
	value: PropTypes.string,
	label: PropTypes.string.isRequired,
	selected: PropTypes.bool,
	focused: PropTypes.bool
}