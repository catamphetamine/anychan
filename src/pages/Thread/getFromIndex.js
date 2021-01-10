import getRequestedCommentIndex from './getRequestedCommentIndex'

export default function getFromIndex({
	getState,
	location,
	latestReadCommentIndex: initialLatestReadCommentIndex
}) {
	const {
		channel,
		thread
	} = getState()
	const requestedCommentIndex = getRequestedCommentIndex(thread, location)
	// This variable is also copy-pasted in `useFromIndex.js`.
	const initiallyShowCommentsFromTheLatestReadOne = requestedCommentIndex === undefined && initialLatestReadCommentIndex !== undefined
	const howManyCommentsToShowBeforeLatestReadComment = 0
	return getInitialFromIndex(
		channel,
		thread,
		location,
		initialLatestReadCommentIndex,
		requestedCommentIndex,
		initiallyShowCommentsFromTheLatestReadOne,
		howManyCommentsToShowBeforeLatestReadComment
	)
}

function getInitialFromIndex(
	channel,
	thread,
	location,
	initialLatestReadCommentIndex,
	requestedCommentIndex,
	initiallyShowCommentsFromTheLatestReadOne,
	howManyCommentsToShowBeforeLatestReadComment
) {
	if (requestedCommentIndex !== undefined) {
		return requestedCommentIndex
	}
	if (initiallyShowCommentsFromTheLatestReadOne) {
		// Always show some of the previous comments
		// just so that the user is a bit more confident
		// that they didn't accidentally miss any.
		return Math.max(0, initialLatestReadCommentIndex - howManyCommentsToShowBeforeLatestReadComment)
	}
	return 0
}