import { goForward, wasInstantNavigation } from 'react-pages'

import { isThreadLocation, isChannelLocation } from '../../utility/routes'

/**
 * Returns a "go to" function if can go back to thread page
 * from channel page.
 * @param  {string} channelId
 * @param  {number} threadId
 * @return {function} [goto]
 */
export default function canGoBackToThreadFromChannel({
	channelId,
	threadId,
	currentRoute
}) {
	if (isChannelLocation(currentRoute)) {
		// "previously visited" route is logically a "next" one,
		// in terms of "history" entries order.
		const nextRoute = window._previouslyVisitedRoute
		if (nextRoute &&
			isThreadLocation(nextRoute) &&
			nextRoute.params.channelId === String(channelId) &&
			nextRoute.params.threadId === String(threadId) &&
			wasInstantNavigation()) {
			return goForward
		}
	}
}