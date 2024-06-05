import type { Channel } from '@/types'

import { useMemo, useCallback } from 'react'
import { useSelector } from '@/hooks'

export default function useChannelsExceptFavorite() {
	// Channels won't be loaded in "offline" mode, in which case `channels` will be `undefined`.
	const channels = useSelector(state => state.channels.channels)
	const channelsSortedByPopularity = useSelector(state => state.channels.channelsSortedByPopularity)
	const channelsByCategory = useSelector(state => state.channels.channelsByCategory)

	const favoriteChannels = useSelector(state => state.favoriteChannels.favoriteChannels)

	// Exclude `favoriteChannels` from the list of available channels.
	const exceptFavoriteChannels = useCallback((channels: Channel[]) => {
		return channels && channels.filter(channel => !favoriteChannels.find(_ => _.id === channel.id))
	}, [favoriteChannels])

	const _channels = useMemo(() => {
		return exceptFavoriteChannels(channels)
	}, [channels, exceptFavoriteChannels])

	const _channelsSortedByPopularity = useMemo(() => {
		return exceptFavoriteChannels(channelsSortedByPopularity)
	}, [channelsSortedByPopularity, exceptFavoriteChannels])

	const _channelsByCategory = useMemo(() => {
		if (channelsByCategory) {
			return channelsByCategory.map(({ category, channels }) => {
				const _channels = exceptFavoriteChannels(channels)
				if (_channels.length === 0) {
					return
				}
				return { category, channels: _channels }
			}).filter(_ => _)
		}
	}, [channelsByCategory, exceptFavoriteChannels])

	return useMemo(() => ({
		channels: _channels,
		channelsSortedByPopularity: _channelsSortedByPopularity,
		channelsByCategory: _channelsByCategory
	}), [
		_channels,
		_channelsSortedByPopularity,
		_channelsByCategory
	])
}