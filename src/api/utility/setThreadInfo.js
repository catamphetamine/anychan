export default function setThreadInfo(thread, { mode, votes }) {
	thread.comments[0].commentsCount = thread.commentsCount
	thread.comments[0].commentAttachmentsCount = thread.commentAttachmentsCount
	thread.comments[0].uniquePostersCount = thread.uniquePostersCount
	// `isRootComment` is used for showing full-size attachment thumbnail
	// on main thread posts on `4chan.org`.
	thread.comments[0].isRootComment = true
	// `isBumpLimitReached`, `isSticky` and others are used for post header badges.
	thread.comments[0].isBumpLimitReached = thread.isBumpLimitReached
	thread.comments[0].isSticky = thread.isSticky
	thread.comments[0].isRolling = thread.isRolling
	thread.comments[0].isLocked = thread.isLocked
	// Set viewing mode (board, thread).
	// Also set votes.
	for (const comment of thread.comments) {
		comment.mode = mode
		comment.vote = votes[comment.id]
	}
	// Set "thread shows author IDs" flag.
	const hasAuthorIds = thread.comments.some(comment => comment.authorId)
	if (hasAuthorIds) {
		for (const comment of thread.comments) {
			comment.threadHasAuthorIds = true
		}
	}
}
