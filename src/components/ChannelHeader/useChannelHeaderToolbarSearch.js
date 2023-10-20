import { useState, useMemo } from 'react'
import { useDispatch } from 'react-redux'

import useMessages from '../../hooks/useMessages.js'

import { notify } from '../../redux/notifications.js'

import SearchIconOutline from 'frontend-lib/icons/fill-and-outline/search-outline.svg'
import SearchIconFill from 'frontend-lib/icons/fill-and-outline/search-fill.svg'

export default function useChannelHeaderToolbarSearch() {
	const dispatch = useDispatch()
	const messages = useMessages()

	const [isSearchBarShown, setSearchBarShown] = useState()

	return useMemo(() => ({
		title: messages.actions.search,
		onClick: () => dispatch(notify(messages.notImplemented)),
		// onClick: () => setSearchBarShown(!isSearchBarShown),
		isSelected: isSearchBarShown,
		icon: SearchIconOutline,
		iconSelected: SearchIconFill,
		size: 's'
	}), [
		isSearchBarShown,
		setSearchBarShown,
		messages
	])
}