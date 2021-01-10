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
	const autoSuggestFavoriteChannels = useSelector(({ settings }) => settings.settings.autoSuggestFavoriteChannels)

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

	let children
	if (editingFavoriteChannels) {
		children = <EditFavoriteChannels/>
	} else {
		if (favoriteChannels.length === 0) {
			// If a user has disabled "auto-suggest favorite channels" feature,
			// then, if the "Favorite Channels" section simply wouldn't be rendered,
			// they wouldn't have any way of adding new "Favorite Channels" after
			// they've previously cleared the list.
			// Therefore, only "don't render anything" if `autoSuggestFavoriteChannels`
			// flag is at the default behavior ("on").
			if (autoSuggestFavoriteChannels === false) {
				children = (
					<div className="SidebarSection-text">
						—
					</div>
				)
			}
		} else {
			children = <FavoriteChannels channels={favoriteChannels}/>
		}
	}

	if (children) {
		return (
			<SidebarSection
				title={getMessages(locale).boards.title}
				moreLabel={getMessages(locale).actions.edit}
				onMore={onMore}>
				{children}
			</SidebarSection>
		)
	}

	return null
}

FavoriteChannelsSidebarSection.propTypes = {
	// channel: channel.isRequired,
	// locale: PropTypes.string.isRequired,
	// dispatch: PropTypes.func.isRequired
}