import React from 'react'
import { useSelector } from 'react-redux'

import ChannelsListInSidebar from './ChannelsList/ChannelsListInSidebar.js'

export default function FavoriteChannels() {
	const favoriteChannels = useSelector(state => state.favoriteChannels.favoriteChannels)

	return (
		<ChannelsListInSidebar
			channels={favoriteChannels}
		/>
	)
}