import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'

import ChannelsListSearchInput from './ChannelsListSearchInput.js'
import { channelShape } from './ChannelsListBase.js'

import useMessages from '../../hooks/useMessages.js'

import './ChannelsListSearch.css'

export default function ChannelsListSearch({
	channels,
	setSearchResults
}) {
	const messages = useMessages()

	const [anythingFound, setAnythingFound] = useState(false)
	const [searchQuery, setSearchQuery] = useState()

	const onSearchQueryChange = useCallback((query) => {
		query = query.toLowerCase()
		const searchResults = channels.filter((channel) => {
			// Some channels on `8ch.net` don't have a name.
			return (channel.title && channel.title.toLowerCase().includes(query)) ||
				channel.id.toLowerCase().includes(query)
		})
		setSearchQuery(query)
		setAnythingFound(searchResults.length > 0)
		setSearchResults(searchResults)
	}, [
		channels,
		setSearchResults,
		setSearchQuery
	])

	return (
		<>
			<ChannelsListSearchInput
				searchQuery={searchQuery}
				onSearchQueryChange={onSearchQueryChange}
				channels={channels}
			/>

			{searchQuery && anythingFound &&
				<div className="Channels-nothingFound">
					{messages.noSearchResults}
				</div>
			}
		</>
	)
}

ChannelsListSearch.propTypes = {
	channels: PropTypes.arrayOf(PropTypes.shape(channelShape)).isRequired,
	setSearchResults: PropTypes.func.isRequired
}