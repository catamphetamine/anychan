import type { Thread } from '@/types'

import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'

import SidebarTopBar from '../Sidebar/SidebarTopBar.js'
import ChannelHeader from '../ChannelHeader/ChannelHeader.js'

import useRoute from '../../hooks/useRoute.js'
import useSetting from '../../hooks/useSetting.js'
import usePageStateSelectorOutsideOfPage from '../../hooks/usePageStateSelectorOutsideOfPage.js'

import isThreadPage from '../../utility/routes/isThreadPage.js'
import isChannelPage from '../../utility/routes/isChannelPage.js'

import './ChannelThreadsSidebarStickyHeader.css'

export default function ChannelThreadsSidebarStickyHeader({
	setSearchResultsQuery,
	setSearchResults
}: ChannelThreadsSidebarStickyHeaderProps) {
	const channel = usePageStateSelectorOutsideOfPage('channel', state => state.channel.channel)
	const threads = usePageStateSelectorOutsideOfPage('channel', state => state.channel.threads)

	const channelLayout = useSetting(settings => settings.channelLayout)
	const channelSorting = useSetting(settings => settings.channelSorting)

	const route = useRoute()
	const isChannelOrThreadPage = isChannelPage(route) || isThreadPage(route)

	const [searchQuery, setSearchQuery] = useState<string>()

	const onSearchResults = useCallback((searchResults: Thread[],
		{
			query,
			finished,
			duration
		}: {
			query: string,
			finished: boolean,
			duration: number
		}
	) => {
		setSearchResultsQuery(query)
		setSearchResults(searchResults)
	}, [
		setSearchResultsQuery,
		setSearchResults
	])

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
				channel={channel}
				threads={threads}
				searchQuery={searchQuery}
				onSearchQueryChange={setSearchQuery}
				onSearchResults={onSearchResults}
				alignTitle="start"
				canChangeChannelLayout={false}
				channelLayout={channelLayout}
				channelSorting={channelSorting}
				canChangeChannelSorting
				className="ChannelThreadsSidebarStickyHeader"
			/>
		</SidebarTopBar>
	)
}

ChannelThreadsSidebarStickyHeader.propTypes = {
	setSearchResultsQuery: PropTypes.func.isRequired,
	setSearchResults: PropTypes.func.isRequired
}

interface ChannelThreadsSidebarStickyHeaderProps {
	setSearchResultsQuery: (searchQuery?: string) => void,
	setSearchResults: (searchResults: Thread[]) => void
}