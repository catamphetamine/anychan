import React, { useMemo, useCallback } from 'react'
import { useSelector } from 'react-redux'

import Channels from './Channels.js'

export default function AvailableChannels(props) {
	const favoriteChannels = useSelector(state => state.favoriteChannels.favoriteChannels)

	// Channels won't be loaded in "offline" mode.
	const availableChannels = useSelector(state => state.data.channels)
	const channels = availableChannels || []

	const channelsByPopularity = useSelector(state => state.data.channelsByPopularity)
	const channelsByCategory = useSelector(state => state.data.channelsByCategory)
	const hasMoreChannels = useSelector(state => state.data.hasMoreChannels)
	const selectedChannel = useSelector(state => state.data.channel)

	// Exclude `favoriteChannels` from the list of available channels.
	const exceptFavoriteChannels = useCallback((channels) => {
		return channels && channels.filter(channel => !favoriteChannels.find(_ => _.id === channel.id))
	}, [favoriteChannels])

	const _channels = useMemo(() => exceptFavoriteChannels(channels), [channels, exceptFavoriteChannels])
	const _channelsByPopularity = useMemo(() => exceptFavoriteChannels(channelsByPopularity), [channelsByPopularity, exceptFavoriteChannels])
	const _channelsByCategory = useMemo(() => exceptFavoriteChannels(channelsByCategory), [channelsByCategory, exceptFavoriteChannels])

	const channelsView = useSelector(state => state.settings.settings.channelsView)

	return (
		<Channels
			highlightSelectedChannel
			shouldSaveChannelsView
			channels={_channels}
			channelsByPopularity={_channelsByPopularity}
			channelsByCategory={_channelsByCategory}
			hasMoreChannels={hasMoreChannels}
			selectedChannel={selectedChannel}
			channelsView={channelsView}
			{...props}
		/>
	)
}