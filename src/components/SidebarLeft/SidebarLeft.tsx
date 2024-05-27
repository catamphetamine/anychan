import type { Thread } from '@/types'

import React, { useMemo, useState } from 'react'

import Sidebar from '../Sidebar/Sidebar.js'

import ChannelThreadsSidebarStickyHeader from '../SidebarStickyHeaders/ChannelThreadsSidebarStickyHeader.js'
import ChannelThreadsSidebarSection from '../SidebarSections/ChannelThreadsSidebarSection.js'

import { usePageStateSelectorOutsideOfPage } from '@/hooks'

import './SidebarLeft.css'

const SidebarLeft = React.forwardRef<HTMLElement>((props, ref) => {
	const [searchResults, setSearchResults] = useState<Thread[]>()
	const [searchResultsQuery, setSearchResultsQuery] = useState<string>()

	const stickyHeaderProps = useMemo(() => ({
		setSearchResultsQuery,
		setSearchResults
	}), [])

	return (
		<Sidebar
			ref={ref}
			StickyHeader={ChannelThreadsSidebarStickyHeader}
			stickyHeaderProps={stickyHeaderProps}
			className="SidebarLeft">
			<ChannelThreadsSidebarSection
				searchResultsQuery={searchResultsQuery}
				searchResults={searchResults}
			/>
		</Sidebar>
	)
})

const SidebarLeftRemountable = React.forwardRef<HTMLElement>((props, ref) => {
	const channel = usePageStateSelectorOutsideOfPage('channel', state => state.channel.channel)

	// Added `key` property to re-mount `StickyHeader` whenever the current channel changes.
	// That resets the state of the `<SearchInput/>`: search query, search results, etc.
	return (
		<SidebarLeft ref={ref} key={channel && channel.id}/>
	)
})

export default SidebarLeftRemountable