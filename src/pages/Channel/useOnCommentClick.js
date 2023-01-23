import { useRef, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { goto } from 'react-pages'

import getGoBackToThreadFromChannel from './getGoBackToThreadFromChannel.js'

import useRoute from '../../hooks/useRoute.js'

import isChannelPage from '../../utility/routes/isChannelPage.js'
import getUrl from '../../utility/getUrl.js'

// Skips loading the thread page if the thread has been viewed before.
export default function useOnCommentClick() {
	const dispatch = useDispatch()

	// Looks like, due to how the whole thing works, `found.resolvedMatch`
	// still refers to the previous page's location on the initial render
	// of the "current" page, but right after that it switches to the correct
	// "current" page's location.
	//
	// That weirdness prevents `onThreadClick()` from declaring zero dependencies,
	// because it uses `channelRoute` which is read from `found.resolvedMatch`
	// which does change after the initial render, as noted above.
	//
	// Therefore, a `ref` workaround is used to prevent `onThreadClick()` function
	// reference from changing after `found` router has fixed `found.resolvedMatch`
	// right after the initial render.
	//
	// Not changing `onThreadClick()` function reference is because
	// it's a dependency of `itemComponentProps` which shouldn't change
	// needlessly so that thread cards aren't rerendered needlessly.
	// (a minor optimization, but maybe I'm a perfectionist)
	//
	const channelRoute = useRoute()
	const channelRouteRef = useRef()
	channelRouteRef.current = channelRoute

	return useCallback(async (commentId, threadId, channelId) => {
		const targetCommentId = commentId === threadId ? undefined : commentId

		// See if can transition to the thread page skipping loading thread data.
		//
		// The `if (isChannelPage(channelRoute))` condition wors around
		// the weirdness in `found` router when `found.resolvedMatch` still points
		// to the previous route's location on initial render, and is updated
		// to the correct "current" page location right after the initial render.
		//
		if (isChannelPage(channelRoute)) {
			const goBackToThreadFromChannel = getGoBackToThreadFromChannel({
				commentId: targetCommentId,
				channelId,
				threadId,
				channelRoute: channelRouteRef.current
			})
			if (goBackToThreadFromChannel) {
				return dispatch(goBackToThreadFromChannel())
			}
		}

		// Navigate to the thread page normally: first load the data and then
		// render the thread page.
		//
		// The only reason the navigation here is done programmatically via `goto()`
		// is because a thread card can't be implmented as a `<Link/>` element
		// because it itself can contain links — the ones in the "original" comment
		// of the thread. The error would be: "<a> cannot appear as a descendant of <a>".
		//
		dispatch(goto(getUrl(channelId, threadId, targetCommentId), { instantBack: true }))
	}, [])
}