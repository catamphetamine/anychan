import React from 'react'
import { useSelector } from 'react-redux'

import Channels from '../Channels'
import SidebarSection from './SidebarSection'

import getMessages from '../../messages'

export default function ChannelsSidebarSection() {
	const locale = useSelector(({ settings }) => settings.settings.locale)
	const autoSuggestFavoriteChannels = useSelector(({ settings }) => settings.settings.autoSuggestFavoriteChannels)
	const favoriteChannels = useSelector(({ favoriteChannels }) => favoriteChannels.favoriteChannels)

	let title
	if (favoriteChannels.length > 0 || autoSuggestFavoriteChannels === false) {
		title = getMessages(locale).boards.moreBoards
	} else {
		title = getMessages(locale).boards.title
	}

	return (
		<SidebarSection title={title}>
			<Channels/>
		</SidebarSection>
	)
}