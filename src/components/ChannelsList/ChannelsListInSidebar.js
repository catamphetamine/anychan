import React from 'react'
import { useSelector } from 'react-redux'

import isThreadPage from '../../utility/routes/isThreadPage.js'
import isChannelPage from '../../utility/routes/isChannelPage.js'

import ChannelsList from './ChannelsList.js'

import useRoute from '../../hooks/useRoute.js'

export default function ChannelsListInSidebar(props) {
	const route = useRoute()

	const isChannelOrThreadLocation = useSelector(state => {
		return isChannelPage(route) || isThreadPage(route)
	})

	const selectedChannel = useSelector(state => state.data.channel)

	return (
		<ChannelsList
			{...props}
			highlightSelectedChannel
			selectedChannel={isChannelOrThreadLocation ? selectedChannel : undefined}
		/>
	)
}

// // Don't re-render `<Channels/>` on page navigation (on `route` change).
// // Re-rendering `<Channels/>` is about `150` ms (which is a lot).
// // (seems that rendering a `<Link/>` is a long time).
// ChannelsListInSidebar = React.memo(ChannelsListInSidebar)