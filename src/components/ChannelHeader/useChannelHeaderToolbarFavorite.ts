import type { Channel } from '@/types'

import { useMemo } from 'react'

import StarIconOutline from 'frontend-lib/icons/fill-and-outline/star-outline.svg'
import StarIconFill from 'frontend-lib/icons/fill-and-outline/star-fill.svg'
import StarIcon from '../StarIcon.js'

import useFavoriteChannel from './useFavoriteChannel.js'
import useMessages from '../../hooks/useMessages.js'

export default function useChannelHeaderToolbarFavorite({
	channel: channelData
}: {
	channel: Channel
}) {
	const messages = useMessages()

	const channel = useMemo(() => ({
		id: channelData.id,
		title: channelData.title
	}), [channelData])

	const { isFavoriteChannel, setFavoriteChannel } = useFavoriteChannel({ channel })

	return useMemo(() => ({
		title: isFavoriteChannel ? messages.favoriteBoards.remove : messages.favoriteBoards.add,
		onClick: () => setFavoriteChannel(!isFavoriteChannel),
		isSelected: isFavoriteChannel,
		animate: 'pop',
		icon: StarIconOutline,
		iconActive: StarIconFill,
		iconSelected: StarIcon,
		iconSelectedActive: StarIconFill,
		className: 'ChannelHeaderToolbar-favoriteChannelButton'
	}), [
		isFavoriteChannel,
		setFavoriteChannel,
		messages
	])
}