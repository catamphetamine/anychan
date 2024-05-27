import type { Channel } from '@/types'

import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'

import ChannelsListSearchInput from './ChannelsListSearchInput.js'

import { channelShape } from './ChannelsList.propTypes.js'

import useMessages from '../../hooks/useMessages.js'

import './ChannelsListSearch.css'

export default function ChannelsListSearch({
	channels,
	setSearchResults
}: ChannelsListSearchProps) {
	const messages = useMessages()

	const [anythingFound, setAnythingFound] = useState(false)
	const [searchQuery, setSearchQuery] = useState<string>()

	const onSearchQueryChange = useCallback((query: string) => {
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
			/>

			{searchQuery && !anythingFound &&
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

interface ChannelsListSearchProps {
	channels: Channel[],
	setSearchResults: (channels: Channel[]) => void
}