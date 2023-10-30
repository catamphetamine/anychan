import React, { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import Sidebar from '../Sidebar/Sidebar.js'

import ChannelThreadsSidebarStickyHeader from '../SidebarStickyHeaders/ChannelThreadsSidebarStickyHeader.js'

import ChannelThreadsSidebarSection from '../SidebarSections/ChannelThreadsSidebarSection.js'

import './SidebarLeft.css'

const SidebarLeft = React.forwardRef((props, ref) => {
	const [searchResults, setSearchResults] = useState()
	const [searchResultsQuery, setSearchResultsQuery] = useState()

	const stickyHeaderProps = useMemo(() => ({
		setSearchResults,
		setSearchResultsQuery
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

function SidebarLeftRemountable(props, ref) {
	const channel = useSelector(state => state.data.channel)

	// Added `key` property to re-mount `StickyHeader` whenever the current channel changes.
	// That resets the state of the `<SearchInput/>`: search query, search results, etc.
	return (
		<SidebarLeft ref={ref} key={channel && channel.id}/>
	)
}

SidebarLeftRemountable = React.forwardRef(SidebarLeftRemountable)

export default SidebarLeftRemountable