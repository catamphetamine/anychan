import React, { useState, useMemo, useCallback } from 'react'
import { useSelector } from 'react-redux'

import AvailableChannels from '../AvailableChannels.js'
import GoToChannelModal from '../GoToChannelModal.js'
import SidebarSection from '../Sidebar/SidebarSection.js'

import useMessages from '../../hooks/useMessages.js'
import useSetting from '../../hooks/useSetting.js'

import SearchIcon from 'frontend-lib/icons/search.svg'

export default function AvailableChannelsSidebarSection() {
	const messages = useMessages()

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

	const autoSuggestFavoriteChannels = useSetting(settings => settings.autoSuggestFavoriteChannels)
	const favoriteChannels = useSelector(state => state.favoriteChannels.favoriteChannels)

	let title
	if (favoriteChannels.length > 0 || autoSuggestFavoriteChannels === false) {
		title = messages.boards.moreBoards
	} else {
		title = messages.boards.title
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