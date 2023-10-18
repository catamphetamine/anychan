import React from 'react'
import PropTypes from 'prop-types'
import { TextInput } from 'react-responsive-ui'

import useMessages from '../../hooks/useMessages.js'

import SearchIcon from 'frontend-lib/icons/fill-and-outline/search-outline.svg'

export default function ChannelsListSearchInput({
	searchQuery,
	onSearchQueryChange
}) {
	const messages = useMessages()

	return (
		<TextInput
			type="search"
			autoFocus
			icon={SearchIcon}
			placeholder={messages.search}
			value={searchQuery}
			onChange={onSearchQueryChange}
			className="Channels-search"
		/>
	)
}

ChannelsListSearchInput.propTypes = {
	searchQuery: PropTypes.string,
	onSearchQueryChange: PropTypes.func.isRequired
}