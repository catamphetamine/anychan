import React, { useMemo } from 'react'

import { useSelector } from '@/hooks'

import ChannelsListInSidebar from './ChannelsList/ChannelsListInSidebar.js'

export default function FavoriteChannels() {
	const favoriteChannels = useSelector(state => state.favoriteChannels.favoriteChannels)

	const favoriteChannelsAsChannels = useMemo(() => {
		return favoriteChannels.map((favoriteChannel) => ({
			...favoriteChannel,
			post: {},
			features: {}
		}))
	}, [favoriteChannels])

	return (
		<ChannelsListInSidebar
			channels={favoriteChannelsAsChannels}
		/>
	)
}