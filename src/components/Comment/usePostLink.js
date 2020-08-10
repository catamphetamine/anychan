import { useCallback } from 'react'

export default function usePostLink({
	board,
	thread,
	comment,
	onShowComment
}) {
	const onPostLinkClick = useCallback((event, {
		postWasDeleted,
		postIsExternal,
		boardId,
		threadId,
		postId
	}) => {
		if (!postIsExternal) {
			if (boardId === board.id && threadId === thread.id) {
				event.preventDefault()
				onShowComment(postId, comment.id)
			}
		}
	}, [
		board,
		thread,
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