import React from 'react'
import { useSelector } from 'react-redux'

import SidebarTopBar from '../Sidebar/SidebarTopBar.js'
import ChannelHeader from '../ChannelHeader/ChannelHeader.js'

import useRoute from '../../hooks/useRoute.js'
import useSetting from '../../hooks/useSetting.js'

import isThreadPage from '../../utility/routes/isThreadPage.js'
import isChannelPage from '../../utility/routes/isChannelPage.js'

import './ChannelThreadsSidebarStickyHeader.css'

export default function ChannelThreadsSidebarStickyHeader() {
	const threads = useSelector(state => state.data.threads)
	const channelView = useSetting(settings => settings.channelView)

	const route = useRoute()
	const isChannelOrThreadPage = isChannelPage(route) || isThreadPage(route)

	if (!isChannelOrThreadPage) {
		return null
	}

	// If no `threads` list has been loaded on the channel page
	// then there's no threads list to show.
	// This could happen when the user navigates directly to a thread page URL.
	if (!threads) {
		return null
	}

	return (
		<SidebarTopBar>
			<ChannelHeader
				alignTitle="start"
				channelView={channelView}
				className="ChannelThreadsSidebarStickyHeader"
			/>
		</SidebarTopBar>
	)
}