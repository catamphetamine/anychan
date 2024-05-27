import type { ChannelsListView } from '@/types'

import React from 'react'
import { useSelector } from '@/hooks'

import ChannelsListInSidebar from './ChannelsList/ChannelsListInSidebar.js'

import useSetting from '../hooks/useSetting.js'

import useChannelsExceptFavorite from './useChannelsExceptFavorite.js'

export default function AvailableChannels() {
	const hasMoreChannels = useSelector(state => state.channels.hasMoreChannels)

	const channelsView = useSetting(settings => settings.channelsView)

	const {
		channels,
		channelsByPopularity,
		channelsByCategory
	} = useChannelsExceptFavorite()

	return (
		<ChannelsListInSidebar
			views={VIEWS}
			showAllChannelsLink
			shouldSaveChannelsView
			channels={channels}
			channelsByPopularity={channelsByPopularity}
			channelsByCategory={channelsByCategory}
			hasMoreChannels={hasMoreChannels}
			channelsView={channelsView}
		/>
	)
}

const VIEWS: ChannelsListView[] = ['list', 'by-category']