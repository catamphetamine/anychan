import type { Props } from '@/types'

import React from 'react'
import { useSelector } from 'react-redux'

import isThreadPage from '../../utility/routes/isThreadPage.js'
import isChannelPage from '../../utility/routes/isChannelPage.js'

import ChannelsList from './ChannelsList.js'

import useRoute from '../../hooks/useRoute.js'
import { usePageStateSelectorOutsideOfPage } from '@/hooks'

export default function ChannelsListInSidebar(props: ChannelsListInSidebarProps) {
	const route = useRoute()

	const isChannelOrThreadLocation = useSelector(state => {
		return isChannelPage(route) || isThreadPage(route)
	})

	const channel = usePageStateSelectorOutsideOfPage('channel', state => state.channel.channel)

	return (
		<ChannelsList
			{...props}
			highlightSelectedChannel
			selectedChannel={isChannelOrThreadLocation ? channel : undefined}
		/>
	)
}

// // Don't re-render `<Channels/>` on page navigation (on `route` change).
// // Re-rendering `<Channels/>` is about `150` ms (which is a lot).
// // (seems that rendering a `<Link/>` is a long time).
// ChannelsListInSidebar = React.memo(ChannelsListInSidebar)

type ChannelsListInSidebarProps = Props<typeof ChannelsList>