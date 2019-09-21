import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { FavoriteBoards } from './Boards'
import SidebarSection from './SidebarSection'
import EditFavoriteBoards from './EditFavoriteBoards'

import getMessages from '../messages'
import { getBoards } from '../redux/chan'

@connect(({ settings, chan, favoriteBoards }) => ({
	locale: settings.settings.locale,
	favoriteBoards: favoriteBoards.favoriteBoards,
	allBoards: chan.allBoards && chan.allBoards.boards
}), (dispatch) => ({ dispatch }))
export default class FavoriteBoardsSidebarSection_ extends React.Component {
	render() {
		return <FavoriteBoardsSidebarSection {...this.props}/>
	}
}

function FavoriteBoardsSidebarSection({
	favoriteBoards,
	allBoards,
	locale,
	dispatch
}) {
	const [editingFavoriteBoards, setEditingFavoriteBoards] = useState()
	const onMore = useCallback(async (isEditMode) => {
		if (isEditMode && !allBoards) {
			await dispatch(getBoards({ all: true }))
		}
		setEditingFavoriteBoards(isEditMode)
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
	board: board.isRequired,
	locale: PropTypes.string.isRequired,
	dispatch: PropTypes.func.isRequired
}