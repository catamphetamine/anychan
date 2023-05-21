import React, { useState, useCallback, useRef } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'

import FavoriteChannels from '../FavoriteChannels.js'
import SidebarSection from '../Sidebar/SidebarSection.js'
import EditFavoriteChannels from '../EditFavoriteChannels.js'

import useMessages from '../../hooks/useMessages.js'
import useSetting from '../../hooks/useSetting.js'
import useSettings from '../../hooks/useSettings.js'
import useDataSource from '../../hooks/useDataSource.js'

import { getChannels } from '../../redux/data.js'

export default function FavoriteChannelsSidebarSection() {
	const dispatch = useDispatch()
	const messages = useMessages()
	const userSettings = useSettings()
	const dataSource = useDataSource()

	const moreButtonRef = useRef()

	const autoSuggestFavoriteChannels = useSetting(settings => settings.autoSuggestFavoriteChannels)
	const favoriteChannels = useSelector(state => state.favoriteChannels.favoriteChannels)
	const allChannels = useSelector(state => state.data.allChannels && state.data.allChannels.channels)

	const [editingFavoriteChannels, setEditingFavoriteChannels] = useState()

	// Not using `async` here to prevent the focus
	// from being lost on unpush.
	const onMore = useCallback((isEditMode) => {
		const finish = () => setEditingFavoriteChannels(isEditMode)
		if (isEditMode && !allChannels) {
			return dispatch(getChannels({ all: true, userSettings, dataSource })).then(finish)
		} else {
			finish()
		}
	}, [dispatch, userSettings, allChannels, dataSource])

	let children
	if (editingFavoriteChannels) {
		children = (
			<EditFavoriteChannels
				onExitEditMode={() => {
					moreButtonRef.current.focus()
					moreButtonRef.current.click()
				}}
			/>
		)
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
					<div className="SidebarSection-text SidebarSection-text--alternative">
						—
					</div>
				)
			}
		} else {
			children = (
				<FavoriteChannels channels={favoriteChannels}/>
			)
		}
	}

	if (children) {
		return (
			<SidebarSection
				title={messages.boards.title}
				moreLabel={messages.actions.edit}
				moreButtonRef={moreButtonRef}
				onMore={onMore}>
				{children}
			</SidebarSection>
		)
	}

	return null
}

FavoriteChannelsSidebarSection.propTypes = {
	// channel: channel.isRequired,
	// dispatch: PropTypes.func.isRequired
}