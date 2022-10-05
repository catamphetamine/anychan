import React from 'react'
import { useSelector } from 'react-redux'

import Channels from '../Channels.js'
import SidebarSection from './SidebarSection.js'

import useMessages from '../../hooks/useMessages.js'

export default function ChannelsSidebarSection() {
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
			<Channels/>
		</SidebarSection>
	)
}