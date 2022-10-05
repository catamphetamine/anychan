import { useCallback } from 'react'
import { goBack, canGoBackInstantly, goto } from 'react-pages'
import { useDispatch } from 'react-redux'

import isChannelPage from '../utility/routes/isChannelPage.js'

export default function useGoBackFromThreadToChannel({ channelId }) {
	const dispatch = useDispatch()
	const onGoBackInstantly = useCallback(() => {
		dispatch(goBack())
	}, [dispatch])
	const onGoBackByNavigation = useCallback(() => {
		// Doesn't perform an "instant back" navigation, because if it was
		// "instant back", then it would have to use `goBack()` instead of
		// `goForward()` in `./src/pages/Channel/getGoBackToThreadFromChannel.js`.
		// Not that it would be something difficult to sort out, but why even bother.
		// It's fine without "instantBack": users shouldn't accidentally click the
		// left-side "Back" button on desktops.
		// , { instantBack: true }
		dispatch(goto(`/${channelId}`))
	}, [dispatch, channelId])
	const previousRoute = window._previouslyVisitedRoute
	if (previousRoute && isChannelPage(previousRoute) && canGoBackInstantly()) {
		return onGoBackInstantly
	}
	return onGoBackByNavigation
}