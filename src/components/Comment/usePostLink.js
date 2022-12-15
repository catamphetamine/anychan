import { useCallback } from 'react'

export default function usePostLink({
	channelId,
	threadId,
	comment,
	onRequestShowCommentFromSameThread
}) {
	const onPostLinkClick = useCallback((event, {
		postWasDeleted,
		postIsExternal,
		channelId: channelIdClicked,
		threadId: threadIdClicked,
		postId
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

	const isPostLinkClickable = useCallback(({ postWasDeleted }) => {
		return !postWasDeleted
	}, [])

	return [
		onPostLinkClick,
		isPostLinkClickable
	]
}