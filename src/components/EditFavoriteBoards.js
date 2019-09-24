import React, { useState, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Autocomplete } from 'react-responsive-ui'
import SortableList from 'react-sortable-dnd-list'
import classNames from 'classnames'

import ListButton from './ListButton'
import BoardUrl from './BoardUrl'

import { board } from '../PropTypes'
import getMessages from '../messages'

import { saveAutoSuggestFavoriteBoards } from '../redux/settings'
import {
	removeFavoriteBoard,
	addFavoriteBoard,
	setFavoriteBoards
} from '../redux/favoriteBoards'

import SearchIcon from 'webapp-frontend/assets/images/icons/menu/search-outline.svg'

import './Boards.css'
import './EditFavoriteBoards.css'

@connect(({ settings, chan, favoriteBoards }) => ({
	favoriteBoards: favoriteBoards.favoriteBoards,
	allBoards: chan.allBoards && chan.allBoards.boards,
	locale: settings.settings.locale
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
	const itemComponentProps = useMemo(() => ({
		locale,
		dispatch
	}), [locale, dispatch])
	const onFavoriteBoardsOrderChange = useCallback((favoriteBoards) => {
		dispatch(setFavoriteBoards(favoriteBoards))
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
			<SortableList
				component="div"
				className="edit-favorite-boards__list"
				value={favoriteBoards}
				onChange={onFavoriteBoardsOrderChange}
				itemComponent={Board}
				itemComponentProps={itemComponentProps}/>
		</section>
	)
}

EditFavoriteBoards.propTypes = {
	favoriteBoards: PropTypes.arrayOf(board).isRequired,
	allBoards: PropTypes.arrayOf(board).isRequired,
	locale: PropTypes.string.isRequired,
	dispatch: PropTypes.func.isRequired
}

function Board({
	children: board,
	locale,
	dispatch,
	style,
	dragging,
	dragged
}) {
	const onRemoveFavoriteBoard = useCallback(async () => {
		await dispatch(removeFavoriteBoard(board))
		// Don't auto-add visited boards to the list of "favorite" boards
		// once the user has deleted a single board from this "auto" list.
		dispatch(saveAutoSuggestFavoriteBoards(false))
	}, [dispatch, board])
	return (
		<div style={style} className={classNames('edit-favorite-boards__board', {
			'edit-favorite-boards__board--dragging': dragging,
			'edit-favorite-boards__board--dragged': dragged
		})}>
			<BoardUrl
				boardId={board.id}
				className="boards-list__board-url"/>
			<span className="boards-list__board-name">
				{board.title}
			</span>
			<ListButton
				muted
				icon="remove"
				onClick={onRemoveFavoriteBoard}
				title={getMessages(locale).actions.remove}
				className="edit-favorite-boards__remove"/>
		</div>
	)
}

Board.propTypes = {
	children: board.isRequired,
	locale: PropTypes.string.isRequired,
	dispatch: PropTypes.func.isRequired,
	style: PropTypes.object
}

function BoardOptionComponent({
	value,
	label,
	selected,
	focused
}) {
	return (
		<span className="edit-favorite-boards__search__option">
			<BoardUrl boardId={value.id}/>
			<span className="rrui__text-line">
				{value.title}
			</span>
		</span>
	)
}

BoardOptionComponent.propTypes = {
	value: PropTypes.string,
	label: PropTypes.string.isRequired,
	selected: PropTypes.bool,
	focused: PropTypes.bool
}