import { useCallback } from 'react'

export default function useGoToComment({
	thread,
	setNewFromIndex
}) {
	useCallback((comment) => {
		const index = thread.comments.indexOf(comment)
		if (index < 0) {
			throw new Error(`Comment ${comment.id} not found`)
		}
		setNewFromIndex(index)
	}, [
		thread,
		setNewFromIndex
	])
}