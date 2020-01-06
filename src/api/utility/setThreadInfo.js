/**
 * Sets utility properties on thread comments.
 * @param {object} thread
 * @param {string} options.mode — Either "thread" (viewing thread page) or "board" (viewing board page).
 * @param {object} options.votes — Own votes in this thread, read from `localStorage`. An object of shape: `{ [commentId]: 1 or -1, ... }`.
 */
export default function setThreadInfo(thread, { mode, votes }) {
	thread.comments[0].commentsCount = thread.commentsCount
	thread.comments[0].attachmentsCount = thread.attachmentsCount
	thread.comments[0].uniquePostersCount = thread.uniquePostersCount
	// `isRootComment` is used for showing full-size attachment thumbnail
	// on main thread posts on `4chan.org`.
	// Also it used in `./ThreadCommentHeader` to not show "original poster" badge
	// on the opening post of a thread.
	thread.comments[0].isRootComment = true
	// `isBumpLimitReached`, `isSticky` and others are used for post header badges.
	thread.comments[0].isBumpLimitReached = thread.isBumpLimitReached
	thread.comments[0].isSticky = thread.isSticky
	thread.comments[0].isRolling = thread.isRolling
	thread.comments[0].isLocked = thread.isLocked
	for (const comment of thread.comments) {
		// Set viewing mode (board, thread).
		comment.mode = mode
		// If the user has previously voted for this comment,
		// set the vote value (`1` or `-1`) on the comment.
		if (votes[comment.id]) {
			comment.vote = votes[comment.id]
		}
	}
	// Set "thread shows author IDs" flag.
	const hasAuthorIds = thread.comments.some(comment => comment.authorId)
	if (hasAuthorIds) {
		for (const comment of thread.comments) {
			comment.threadHasAuthorIds = true
		}
	}
}
