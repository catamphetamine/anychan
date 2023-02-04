import { useCallback } from 'react'

import useGoBackFromThreadToChannel from './useGoBackFromThreadToChannel.js'

export default function useOnChannelLinkClick({ channelId }) {
	const goBack = useGoBackFromThreadToChannel({ channelId })

	const onChannelLinkClick = useCallback((event) => {
		event.preventDefault()
		goBack()
	}, [
		goBack
	])

	return onChannelLinkClick
}