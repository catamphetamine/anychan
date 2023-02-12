import React from 'react'
import { useSelector } from 'react-redux'

import Channels from './Channels.js'

export default function FavoriteChannels(props) {
	const selectedChannel = useSelector(state => state.data.channel)
	return (
		<Channels
			showAllChannelsLink={false}
			selectedChannel={selectedChannel}
			highlightSelectedChannel
			{...props}
		/>
	)
}