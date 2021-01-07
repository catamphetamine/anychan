import React from 'react'
import { useSelector } from 'react-redux'

import Channels from '../Channels'
import SidebarSection from './SidebarSection'

import getMessages from '../../messages'

export default function ChannelsSidebarSection() {
	const locale = useSelector(({ settings }) => settings.settings.locale)
	const favoriteChannels = useSelector(({ favoriteChannels }) => favoriteChannels.favoriteChannels)
	return (
		<SidebarSection title={favoriteChannels.length > 0 ? getMessages(locale).boards.moreBoards : getMessages(locale).boards.title}>
			<Channels/>
		</SidebarSection>
	)
}