import type { Comment, ChannelId, ThreadId, CommentId } from "@/types"

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
	const onPostLinkClick = useCallback((event: Event, {
		postWasDeleted,
		postIsExternal,
		channelId: channelIdClicked,
		threadId: threadIdClicked,
		postId
	}: {
		postWasDeleted?: boolean,
		postIsExternal?: boolean,
		channelId: ChannelId,
		threadId: ThreadId,
		postId: CommentId
	}) => {
		if (!postIsExternal) {
			if (channelIdClicked === channelId && threadIdClicked === threadId) {
				if (onRequestShowCommentFromSameThread) {
					event.preventDefault()
					onRequestShowCommentFromSameThread({
						commentId: postId,
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

	const isPostLinkClickable = useCallback(({ postWasDeleted }: { postWasDeleted: boolean }) => {
		return !postWasDeleted
	}, [])

	return {
		onPostLinkClick,
		isPostLinkClickable
	}
}