import React from 'react'
import { useSelector } from 'react-redux'

import AvailableChannels from '../AvailableChannels.js'
import SidebarSection from '../Sidebar/SidebarSection.js'

import useMessages from '../../hooks/useMessages.js'

export default function AvailableChannelsSidebarSection() {
	const messages = useMessages()

	const autoSuggestFavoriteChannels = useSelector(state => state.settings.settings.autoSuggestFavoriteChannels)
	const favoriteChannels = useSelector(state => state.favoriteChannels.favoriteChannels)

	let title
	if (favoriteChannels.length > 0 || autoSuggestFavoriteChannels === false) {
		title = messages.boards.moreBoards
	} else {
		title = messages.boards.title
	}

	return (
		<SidebarSection title={title}>
			<AvailableChannels/>
		</SidebarSection>
	)
}