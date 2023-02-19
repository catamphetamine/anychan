import getLatestReadCommentIndex from './getLatestReadCommentIndex.js'
import getFirstNewCommentIndex from './getFirstNewCommentIndex.js'

export default function getNewCommentsCount(thread, {
	fromCommentIndex,
	userData
}) {
	if (fromCommentIndex === undefined) {
		fromCommentIndex = getFirstNewCommentIndex(thread, { userData })
		if (fromCommentIndex === undefined) {
			return 0
		}
	}

	let newComments = thread.comments.slice(fromCommentIndex)

	// Skip own comments.
	// Looks for own comments in `userData.getOwnComments()`.
	// Doesn't look in `userData.getOwnThreads()` because
	// the "root comment" of an own thread is always marked as "read"
	// as soon as the thread has been posted by the user.
	const ownCommentIds = userData.getOwnComments(thread.channelId, thread.id)
	newComments = newComments.filter(comment => !ownCommentIds.includes(comment.id))

	return newComments.length
}