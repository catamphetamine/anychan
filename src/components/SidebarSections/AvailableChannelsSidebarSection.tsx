import React, { useState, useMemo, useCallback } from 'react'
import { useSelector } from '@/hooks'

import AvailableChannels from '../AvailableChannels.js'
import GoToChannelModal from '../GoToChannelModal.js'
import SidebarSection from '../Sidebar/SidebarSection.js'

import useMessages from '../../hooks/useMessages.js'
import useSetting from '../../hooks/useSetting.js'

import useChannelsExceptFavorite from '../useChannelsExceptFavorite.js'

import SearchIcon from 'frontend-lib/icons/search.svg'

export default function AvailableChannelsSidebarSection() {
	const messages = useMessages()

	const [showGoToChannelModal, setShowGoToChannelModal] = useState<boolean>()

	const onHideGoToChannelModal = useCallback(() => {
		setShowGoToChannelModal(false)
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

	const autoSuggestFavoriteChannels = useSetting(settings => settings.autoSuggestFavoriteChannels)
	const favoriteChannels = useSelector(state => state.favoriteChannels.favoriteChannels)

	// Channels won't be loaded in "offline" mode, in which case `channels` will be `undefined`.
	const { channels } = useChannelsExceptFavorite()

	let title
	if (favoriteChannels.length > 0 || autoSuggestFavoriteChannels === false) {
		title = messages.boards.moreBoards
	} else {
		title = messages.boards.title
	}

	// If there're some favorite channels and there're no more channels left
	// then don't show the "Channels" sidebar section.
	// Otherwise, if there're any other channels, or if the "Favorite Channels"
	// sidebar section is hidden, the "Channels" sidebar section should be visible.
	//
	// The "Channels" sidebar section shouldn't be hidden when the "Favorite Channels" is hidden too
	// because in that case the user won't be able to access "Search for channels" button.
	//
	if (channels && channels.length === 0 && favoriteChannels.length > 0) {
		return null
	}

	return (
		<SidebarSection
			title={title}
			actions={actions}>
			<AvailableChannels/>
			<GoToChannelModal
				isOpen={showGoToChannelModal}
				close={onHideGoToChannelModal}
			/>
		</SidebarSection>
	)
}