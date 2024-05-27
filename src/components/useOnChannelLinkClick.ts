import type { MouseEvent } from 'react'
import type { ChannelId } from '@/types'

import { useCallback } from 'react'

import useGoBackFromThreadToChannel from './useGoBackFromThreadToChannel.js'

export default function useOnChannelLinkClick({ channelId }: { channelId: ChannelId }) {
	const goBack = useGoBackFromThreadToChannel({ channelId })

	const onChannelLinkClick = useCallback((event: MouseEvent<HTMLAnchorElement>) => {
		event.preventDefault()
		goBack()
	}, [
		goBack
	])

	return onChannelLinkClick
}