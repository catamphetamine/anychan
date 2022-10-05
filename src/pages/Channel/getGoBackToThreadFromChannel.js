import { goForward, wasInstantNavigation } from 'react-pages'

import isThreadPage from '../../utility/routes/isThreadPage.js'

/**
 * Returns a "go to" function if can go back to thread page
 * from channel page.
 * @param  {string} channelId
 * @param  {number} threadId
 * @return {function} [goto]
 */
export default function getGoBackToThreadFromChannel({
	channelId,
	threadId
}) {
	// If a user has already been to that thread's page
	// then it would be the "previously visited" route
	// in terms of browser "history" entries order.
	const previouslyVisitedRoute = window._previouslyVisitedRoute
	if (
		previouslyVisitedRoute &&
		isThreadPage(previouslyVisitedRoute) &&
		previouslyVisitedRoute.params.channelId === channelId &&
		parseInt(previouslyVisitedRoute.params.threadId) === threadId &&
		wasInstantNavigation()
	) {
		return goForward
	}
}