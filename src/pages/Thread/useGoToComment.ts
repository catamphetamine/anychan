import type { Thread, Comment } from '@/types'

import { useCallback } from 'react'

export default function useGoToComment({
	thread,
	setNewFromIndex
}: {
	thread: Thread,
	setNewFromIndex: (fromIndex: number) => void
}) {
	return useCallback((comment: Comment) => {
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