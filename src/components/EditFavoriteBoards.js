import React, { useState, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
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

export default function EditFavoriteBoards() {
	const favoriteBoards = useSelector(({ favoriteBoards }) => favoriteBoards.favoriteBoards)
	const allBoards = useSelector(({ chan }) => chan.allBoards && chan.allBoards.boards)
	const locale = useSelector(({ settings }) => settings.settings.locale)
	const dispatch = useDispatch()
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
		<section className="EditFavoriteBoards">
			<Autocomplete
				autoFocus
				autoComplete="off"
				maxOptions={50}
				optionComponent={BoardOptionComponent}
				icon={SearchIcon}
				className="EditFavoriteBoards-search"
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
				className="EditFavoriteBoards-list"
				value={favoriteBoards}
				onChange={onFavoriteBoardsOrderChange}
				itemComponent={Board}
				itemComponentProps={itemComponentProps}/>
		</section>
	)
}

EditFavoriteBoards.propTypes = {
	// favoriteBoards: PropTypes.arrayOf(board).isRequired,
	// allBoards: PropTypes.arrayOf(board).isRequired,
	// locale: PropTypes.string.isRequired,
	// dispatch: PropTypes.func.isRequired
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
		<div style={style} className={classNames('EditFavoriteBoards-board', {
			'EditFavoriteBoards-board--dragging': dragging,
			'EditFavoriteBoards-board--dragged': dragged
		})}>
			<BoardUrl boardId={board.id} active={dragged}/>
			<span className="EditFavoriteBoards-boardTitle">
				{board.title}
			</span>
			<ListButton
				muted
				icon="remove"
				onClick={onRemoveFavoriteBoard}
				title={getMessages(locale).actions.remove}
				className="EditFavoriteBoards-remove"/>
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
		<span className="EditFavoriteBoards-searchOption">
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