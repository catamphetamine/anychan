import { useCallback } from 'react'
import { useSelector } from 'react-redux'

import isThreadPage from '../utility/routes/isThreadPage.js'
import useRoute from '../hooks/useRoute.js'

import useGoBackFromThreadToChannel from './useGoBackFromThreadToChannel.js'

export default function useCanGoBackFromThreadToChannel() {
	const currentRoute = useRoute()
	const goBackFromThreadToChannel = useGoBackFromThreadToChannel({
		channelId: currentRoute.params.channelId
	})
	if (isThreadPage(currentRoute)) {
		return [true, goBackFromThreadToChannel]
	}
	return [false]
}