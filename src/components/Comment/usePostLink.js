import { useCallback } from 'react'

export default function usePostLink({
	channelId,
	threadId,
	comment,
	onShowComment
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
				event.preventDefault()
				onShowComment(postId, comment.id)
			}
		}
	}, [
		channelId,
		threadId,
		comment,
		onShowComment
	])
	const isPostLinkClickable = useCallback(({ postWasDeleted }) => {
		return !postWasDeleted
	}, [])
	return [
		onPostLinkClick,
		isPostLinkClickable
	]
}