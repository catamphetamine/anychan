import type { Comment, CommentId, ThreadId, ChannelId, UserData } from '@/types'

export default function onCommentOwnershipStatusChange(
	comment: Comment,
	// commentId: CommentId,
	threadId: ThreadId,
	channelId: ChannelId,
	isOwn: boolean,
	userData: UserData
) {
	const commentId: CommentId = comment.id

	if (isOwn) {
		// Update `UserData`.
		userData.addOwnComment(channelId, threadId, commentId)
		if (threadId === commentId) {
			userData.addOwnThread(channelId, threadId)
		}

		// Update `.own` flag on the `comment` object.
		comment.own = true

		// Set "is reply to own comment" flag on replies.
		if (comment.replies) {
			for (const reply of comment.replies) {
				reply.isReplyToOwnComment = true
			}
		}
	} else {
		// Update `UserData`.
		userData.removeOwnComment(channelId, threadId, commentId)
		if (threadId === commentId) {
			userData.removeOwnThread(channelId, threadId)
		}

		// Update `.own` flag on the `comment` object.
		comment.own = false

		// Set "is reply to own comment" flag on replies.
		if (comment.replies) {
			for (const reply of comment.replies) {
				reply.isReplyToOwnComment = false
			}
		}
	}
}