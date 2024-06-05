import type { Comment, ChannelId, ThreadId, CommentId, ContentPostLink } from "@/types"

import { useCallback } from 'react'

export default function usePostLink({
	channelId,
	threadId,
	comment,
	onRequestShowCommentFromSameThread
}: {
	channelId: ChannelId,
	threadId: ThreadId,
	comment: Comment,
	onRequestShowCommentFromSameThread?: (parameters: { commentId: CommentId, fromCommentId: CommentId }) => void
}) {
	const onPostLinkClick = useCallback((event: Event, postLink: ContentPostLink) => {
		const {
			meta: {
				isAnotherThread,
				channelId: channelIdClicked,
				threadId: threadIdClicked,
				commentId
			}
		} = postLink

		if (!isAnotherThread) {
			if (channelIdClicked === channelId && threadIdClicked === threadId) {
				if (onRequestShowCommentFromSameThread) {
					event.preventDefault()
					onRequestShowCommentFromSameThread({
						commentId,
						fromCommentId: comment.id
					})
				}
			}
		}
	}, [
		channelId,
		threadId,
		comment,
		onRequestShowCommentFromSameThread
	])

	const isPostLinkClickable = useCallback(({ isDeleted }: ContentPostLink['meta']) => {
		return !isDeleted
	}, [])

	return {
		onPostLinkClick,
		isPostLinkClickable
	}
}