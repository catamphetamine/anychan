import { useCallback } from 'react'
import { goBack, canGoBackInstantly, goto } from 'react-pages'
import { useDispatch, useSelector } from 'react-redux'

import { isThreadLocation, isChannelLocation } from '../utility/routes'

export default function useCanGoBackFromThreadToChannel({ instant } = {}) {
	const currentRoute = useSelector(({ found }) => found.resolvedMatch)
	const _isThreadLocation = useSelector(({ found }) => isThreadLocation(found.resolvedMatch))
	const dispatch = useDispatch()
	const onGoBackInstantly = useCallback(() => dispatch(goBack()), [dispatch])
	const onGoBackByNavigation = useCallback(() => {
		const { channelId } = currentRoute.params
		dispatch(goto(`/${channelId}`, { instantBack: true }))
	}, [
		dispatch,
		currentRoute
	])
	if (_isThreadLocation) {
		const previousRoute = window._previouslyVisitedRoute
		if (previousRoute && isChannelLocation(previousRoute) && canGoBackInstantly()) {
			return [true, onGoBackInstantly]
		}
		if (!instant) {
			return [true, onGoBackByNavigation]
		}
	}
	return [false]
}