import { RefObject, useMemo } from 'react'

import useMessages from '../../hooks/useMessages.js'

import SearchIconOutline from 'frontend-lib/icons/fill-and-outline/search-outline.svg'
import SearchIconFill from 'frontend-lib/icons/fill-and-outline/search-fill.svg'

export default function useChannelHeaderToolbarSearch({
	onSearchClick,
	searchButtonRef
}: {
	onSearchClick: () => void,
	searchButtonRef: RefObject<HTMLButtonElement>
}) {
	const messages = useMessages()

	return useMemo(() => ({
		ref: searchButtonRef,
		title: messages.actions.search,
		onClick: onSearchClick,
		isSelected: false,
		icon: SearchIconOutline,
		iconSelected: SearchIconFill,
		size: 's',
		className: 'ChannelHeaderToolbarSearchButton'
	}), [
		searchButtonRef,
		onSearchClick,
		messages
	])
}