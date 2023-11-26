import { useCallback } from 'react'
import { useGoBack, canGoBackInstantly, useNavigate } from 'react-pages'
import { useDispatch } from 'react-redux'

import isChannelPage from '../utility/routes/isChannelPage.js'

export default function useGoBackFromThreadToChannel({ channelId }) {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const goBack = useGoBack()

	const onGoBackInstantly = useCallback(() => {
		goBack()
	}, [goBack])

	const onGoBackByNavigation = useCallback(() => {
		// Doesn't perform an "instant back" navigation, because if it was
		// "instant back", then it would have to use `goBack()` instead of
		// `goForward()` in `./src/components/canGoBackToThreadFromChannel.js`.
		// Not that it would be something difficult to sort out, but why even bother.
		// It's fine without "instantBack": users shouldn't accidentally click the
		// left-side "Back" button on desktops.
		// , { instantBack: true }
		navigate(`/${channelId}`)
	}, [navigate, channelId])

	const previouslyVisitedPage = window._previouslyVisitedPage

	if (previouslyVisitedPage && isChannelPage(previouslyVisitedPage) && canGoBackInstantly()) {
		return onGoBackInstantly
	}

	return onGoBackByNavigation
}