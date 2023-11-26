import { wasInstantNavigation } from 'react-pages'

import isThreadPage from '../utility/routes/isThreadPage.js'

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
	commentId
}) {
	// If a user has already been to that thread's page
	// then it would be the "previously visited" route
	// in terms of browser "history" entries order.
	const previouslyVisitedPage = window._previouslyVisitedPage

	// Get previously visited comment ID from location "hash".
	let commentIdFromHash
	if (previouslyVisitedPage && previouslyVisitedPage.location.hash) {
		commentIdFromHash = Number(previouslyVisitedPage.location.hash.slice('#'.length))
	}

	// If the "Back" page corresponds to the specified channel/thread/comment,
	// then simply go "Forward" instead of performing a standard URL navigation.
	if (
		previouslyVisitedPage &&
		isThreadPage(previouslyVisitedPage) &&
		previouslyVisitedPage.params.channelId === channelId &&
		Number(previouslyVisitedPage.params.threadId) === threadId &&
		commentIdFromHash === commentId &&
		wasInstantNavigation()
	) {
		return true
	}
}