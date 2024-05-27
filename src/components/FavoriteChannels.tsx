import React from 'react'

import { useSelector } from '@/hooks'

import ChannelsListInSidebar from './ChannelsList/ChannelsListInSidebar.js'

export default function FavoriteChannels() {
	const favoriteChannels = useSelector(state => state.favoriteChannels.favoriteChannels)

	return (
		<ChannelsListInSidebar
			channels={favoriteChannels}
		/>
	)
}