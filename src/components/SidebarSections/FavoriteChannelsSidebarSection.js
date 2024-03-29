import React, { useState, useCallback, useRef, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'

import FavoriteChannels from '../FavoriteChannels.js'
import SidebarSection from '../Sidebar/SidebarSection.js'
import EditFavoriteChannels from '../EditFavoriteChannels.js'
import GoToChannelModal from '../GoToChannelModal.js'

import useMessages from '../../hooks/useMessages.js'
import useSetting from '../../hooks/useSetting.js'
import useSettings from '../../hooks/useSettings.js'
import useDataSource from '../../hooks/useDataSource.js'
import useMultiDataSource from '../../hooks/useMultiDataSource.js'

import { getChannels } from '../../redux/data.js'

import SearchIcon from 'frontend-lib/icons/search.svg'

export default function FavoriteChannelsSidebarSection() {
	const dispatch = useDispatch()
	const messages = useMessages()
	const userSettings = useSettings()
	const dataSource = useDataSource()
	const multiDataSource = useMultiDataSource()

	const moreButtonRef = useRef()

	const autoSuggestFavoriteChannels = useSetting(settings => settings.autoSuggestFavoriteChannels)
	const favoriteChannels = useSelector(state => state.favoriteChannels.favoriteChannels)
	const allChannels = useSelector(state => state.data.allChannels && state.data.allChannels.channels)

	const [editingFavoriteChannels, setEditingFavoriteChannels] = useState()

	const [showGoToChannelModal, setShowGoToChannelModal] = useState()

	const onHideGoToChannelModal = useCallback(() => {
		setShowGoToChannelModal()
	}, [setShowGoToChannelModal])

	const actions = useMemo(() => [
		{
			title: messages.search,
			onClick: () => {
				setShowGoToChannelModal(true);
			},
			Icon: SearchIcon
		}
	], [])

	// Not using `async` here to prevent the focus
	// from being lost on unpush.
	const onMore = useCallback((isEditMode) => {
		const finish = () => setEditingFavoriteChannels(isEditMode)
		if (isEditMode && !allChannels) {
			return dispatch(getChannels({
				all: true,
				userSettings,
				dataSource,
				multiDataSource,
				messages
			})).then(finish)
		} else {
			finish()
		}
	}, [
		dispatch,
		userSettings,
		allChannels,
		dataSource,
		multiDataSource,
		messages
	])

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
				<FavoriteChannels/>
			)
		}
	}

	if (children) {
		return (
			<SidebarSection
				title={messages.boards.title}
				actions={actions}
				moreLabel={messages.actions.edit}
				moreButtonRef={moreButtonRef}
				onMore={onMore}>
				{children}
				<GoToChannelModal
					isOpen={showGoToChannelModal}
					close={onHideGoToChannelModal}
				/>
			</SidebarSection>
		)
	}

	return null
}

FavoriteChannelsSidebarSection.propTypes = {
	// channel: channel.isRequired,
	// dispatch: PropTypes.func.isRequired
}