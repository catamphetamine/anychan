export default function getNewRepliesCount(thread, {
	fromCommentIndex,
	userData
}) {
	if (fromCommentIndex === undefined) {
		fromCommentIndex = getFirstNewCommentIndex(thread, { userData })
		if (fromCommentIndex === undefined) {
			return 0
		}
	}

	let repliesCount = 0

	const channelId = thread.channelId
	const threadId = thread.id

	const ownThreadIds = userData.getOwnThreads(channelId)
	const ownCommentIds = userData.getOwnComments(channelId, threadId)

	const isOwnThread = ownThreadIds.find(id => id === threadId)

	let i = fromCommentIndex
	while (i < thread.comments.length) {
		const comment = thread.comments[i]

		// Skip own comments.
		if (ownCommentIds.find(id => id === comment.id)) {
			i++
			continue
		}

		// Get the IDs of the comments this comment replies to.
		const inReplyToIds = (comment.inReplyTo || []).map(comment => comment.id).
			concat(comment.inReplyToRemoved || [])

		if (inReplyToIds.length > 0) {
			const isReplyToOwnComment = inReplyToIds.some(
				(inReplyToId) => {
					return ownCommentIds.find(id => id === inReplyToId) ||
						(isOwnThread && inReplyToId === thread.id)
				}
			)
			if (isReplyToOwnComment) {
				repliesCount++
			}
		} else {
			if (isOwnThread) {
				repliesCount++
			}
		}

		i++
	}

	return repliesCount
}