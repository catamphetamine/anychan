import type { ChannelsListView } from '@/types'

import React from 'react'
import { useSelector } from '@/hooks'

import ChannelsListInSidebar from './ChannelsList/ChannelsListInSidebar.js'

import useSetting from '../hooks/useSetting.js'

import useChannelsExceptFavorite from './useChannelsExceptFavorite.js'

export default function AvailableChannels() {
	const channelsView = useSetting(settings => settings.channelsView)

	const {
		channels,
		channelsSortedByPopularity,
		channelsByCategory
	} = useChannelsExceptFavorite()

	return (
		<ChannelsListInSidebar
			views={VIEWS}
			showAllChannelsLink
			shouldSaveChannelsView
			channels={channels}
			channelsSortedByPopularity={channelsSortedByPopularity}
			channelsByCategory={channelsByCategory}
			channelsView={channelsView}
		/>
	)
}

const VIEWS: ChannelsListView[] = ['list', 'by-category']