import type { Thread } from '@/types'
import type { Location } from 'react-pages'

import getRequestedCommentIndex from './getRequestedCommentIndex.js'
import getShouldInitiallyShowCommentsStartingFromTheLatestReadOne from './getShouldInitiallyShowCommentsStartingFromTheLatestReadOne.js'

export default function getFromIndex({
	thread,
	location,
	latestReadCommentIndex: initialLatestReadCommentIndex
}: {
	thread: Thread,
	location: Location,
	latestReadCommentIndex?: number
}) {
	const requestedCommentIndex = getRequestedCommentIndex(thread, location)
	const shouldInitiallyShowCommentsStartingFromTheLatestReadOne = getShouldInitiallyShowCommentsStartingFromTheLatestReadOne({
		requestedCommentIndex,
		initialLatestReadCommentIndex
	})
	const howManyCommentsToShowBeforeLatestReadComment = 0
	return getInitialFromIndex({
		initialLatestReadCommentIndex,
		requestedCommentIndex,
		shouldInitiallyShowCommentsStartingFromTheLatestReadOne,
		howManyCommentsToShowBeforeLatestReadComment
	})
}

function getInitialFromIndex({
	initialLatestReadCommentIndex,
	requestedCommentIndex,
	shouldInitiallyShowCommentsStartingFromTheLatestReadOne,
	howManyCommentsToShowBeforeLatestReadComment
}: {
	initialLatestReadCommentIndex: number,
	requestedCommentIndex?: number,
	shouldInitiallyShowCommentsStartingFromTheLatestReadOne?: boolean,
	howManyCommentsToShowBeforeLatestReadComment: number
}) {
	if (requestedCommentIndex !== undefined) {
		return requestedCommentIndex
	}
	if (shouldInitiallyShowCommentsStartingFromTheLatestReadOne) {
		// Always show some of the previous comments
		// just so that the user is a bit more confident
		// that they didn't accidentally miss any.
		return Math.max(0, initialLatestReadCommentIndex - howManyCommentsToShowBeforeLatestReadComment)
	}
	return 0
}