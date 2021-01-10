import { useRef, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { goto } from 'react-pages'

import canGoBackToThreadFromChannel from './canGoBackToThreadFromChannel'

import getUrl from '../../utility/getUrl'

export default function useOnThreadClick() {
	const dispatch = useDispatch()
	// Looks like, due to how the whole thing works, `found.resolvedMatch`
	// initially still refers to the previous page's location, but right
	// after that it switches to this page's location.
	// This prevents `onThreadClick()` from declaring zero dependencies,
	// because it uses `currentRoute` which is `found.resolvedMatch`
	// so it does change. Therefore, a `ref` workaround is used
	// to prevent `onThreadClick()` from changing but at the same time
	// to have the latest `currentRoute` value inside.
	// The reason why `onThreadClick()` is kept constant is because
	// it's a dependency of `itemComponentProps` which shouldn't change
	// needlessly so that thread cards aren't rerendered needlessly.
	// (a minor optimization, but maybe I'm a perfectionist)
	const currentRoute = useSelector(({ found }) => found.resolvedMatch)
	const currentRouteRef = useRef()
	currentRouteRef.current = currentRoute
	return useCallback(async (comment, threadId, channelId) => {
		const goBackToThreadFromChannel = canGoBackToThreadFromChannel({
			channelId,
			threadId,
			currentRoute: currentRouteRef.current
		})
		if (goBackToThreadFromChannel) {
			return dispatch(goBackToThreadFromChannel())
		}
		// The only reason the navigation is done programmatically via `goto()`
		// is because a thread card can't be a `<Link/>` because
		// "<a> cannot appear as a descendant of <a>".
		dispatch(goto(getUrl(channelId, threadId), { instantBack: true }))
	}, [])
}