import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'

import { FavoriteBoards } from '../Boards'
import SidebarSection from './SidebarSection'
import EditFavoriteBoards from '../EditFavoriteBoards'

import getMessages from '../../messages'
import { getBoards } from '../../redux/chan'

export default function FavoriteBoardsSidebarSection() {
	const favoriteBoards = useSelector(({ favoriteBoards }) => favoriteBoards.favoriteBoards)
	const allBoards = useSelector(({ chan }) => chan.allBoards && chan.allBoards.boards)
	const locale = useSelector(({ settings }) => settings.settings.locale)
	const dispatch = useDispatch()
	const [editingFavoriteBoards, setEditingFavoriteBoards] = useState()
	// Not using `async` here to prevent the focus
	// from being lost on unpush.
	const onMore = useCallback((isEditMode) => {
		const finish = () => setEditingFavoriteBoards(isEditMode)
		if (isEditMode && !allBoards) {
			return dispatch(getBoards({ all: true })).then(finish)
		} else {
			finish()
		}
	}, [dispatch, allBoards])
	if (favoriteBoards.length === 0) {
		return null
	}
	return (
		<SidebarSection
			title={getMessages(locale).boards.title}
			moreLabel={getMessages(locale).actions.edit}
			onMore={onMore}>
			{editingFavoriteBoards && <EditFavoriteBoards/>}
			{!editingFavoriteBoards && <FavoriteBoards boards={favoriteBoards}/>}
		</SidebarSection>
	)
}

FavoriteBoardsSidebarSection.propTypes = {
	// board: board.isRequired,
	// locale: PropTypes.string.isRequired,
	// dispatch: PropTypes.func.isRequired
}