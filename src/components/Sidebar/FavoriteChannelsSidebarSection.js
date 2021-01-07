import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'

import { FavoriteChannels } from '../Channels'
import SidebarSection from './SidebarSection'
import EditFavoriteChannels from '../EditFavoriteChannels'

import getMessages from '../../messages'
import { getChannels } from '../../redux/data'

export default function FavoriteChannelsSidebarSection() {
	const favoriteChannels = useSelector(({ favoriteChannels }) => favoriteChannels.favoriteChannels)
	const allChannels = useSelector(({ data }) => data.allChannels && data.allChannels.channels)
	const locale = useSelector(({ settings }) => settings.settings.locale)
	const dispatch = useDispatch()
	const [editingFavoriteChannels, setEditingFavoriteChannels] = useState()
	// Not using `async` here to prevent the focus
	// from being lost on unpush.
	const onMore = useCallback((isEditMode) => {
		const finish = () => setEditingFavoriteChannels(isEditMode)
		if (isEditMode && !allChannels) {
			return dispatch(getChannels({ all: true })).then(finish)
		} else {
			finish()
		}
	}, [dispatch, allChannels])
	if (favoriteChannels.length === 0) {
		return null
	}
	return (
		<SidebarSection
			title={getMessages(locale).boards.title}
			moreLabel={getMessages(locale).actions.edit}
			onMore={onMore}>
			{editingFavoriteChannels && <EditFavoriteChannels/>}
			{!editingFavoriteChannels && <FavoriteChannels channels={favoriteChannels}/>}
		</SidebarSection>
	)
}

FavoriteChannelsSidebarSection.propTypes = {
	// channel: channel.isRequired,
	// locale: PropTypes.string.isRequired,
	// dispatch: PropTypes.func.isRequired
}