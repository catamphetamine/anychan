export function addToBoardIdThreadIdCommentIds(storage, key, boardId, threadId, commentId) {
	const boardIdThreadIdCommentIds = storage.get(key, {})
	let threadIdCommentIds = boardIdThreadIdCommentIds[boardId]
	if (!threadIdCommentIds) {
		threadIdCommentIds = {}
		boardIdThreadIdCommentIds[boardId] = threadIdCommentIds
	}
	threadId = String(threadId)
	let commentIds = threadIdCommentIds[threadId]
	if (!commentIds) {
		commentIds = []
		threadIdCommentIds[threadId] = commentIds
	}
	const index = commentIds.indexOf(commentId)
	if (index < 0) {
		commentIds.push(commentId)
		commentIds.sort()
		storage.set(key, boardIdThreadIdCommentIds)
	}
}

export function removeFromBoardIdThreadIdCommentIds(storage, key, boardId, threadId, commentId) {
	let boardIdThreadIdCommentIds = storage.get(key)
	if (!boardIdThreadIdCommentIds) {
		return
	}
	if (threadId) {
		const threadIdCommentIds = boardIdThreadIdCommentIds[boardId]
		if (!threadIdCommentIds) {
			return
		}
		threadId = String(threadId)
		if (commentId) {
			const commentIds = threadIdCommentIds[threadId]
			if (!commentIds) {
				return
			}
			const index = commentIds.indexOf(commentId)
			if (index < 0) {
				return
			}
			commentIds.splice(index, 1)
			if (commentIds.length === 0) {
				delete threadIdCommentIds[threadId]
			}
		} else {
			delete threadIdCommentIds[threadId]
		}
		if (Object.keys(threadIdCommentIds).length === 0) {
			delete boardIdThreadIdCommentIds[boardId]
		}
	} else {
		delete boardIdThreadIdCommentIds[boardId]
	}
	if (Object.keys(boardIdThreadIdCommentIds).length === 0) {
		storage.delete(key)
	} else {
		storage.set(key, boardIdThreadIdCommentIds)
	}
}

export function getFromBoardIdThreadIdCommentIds(storage, key, boardId, threadId, commentId) {
	const boardIdThreadIdCommentIds = storage.get(key, {})
	if (boardId) {
		const threadIdCommentIds = boardIdThreadIdCommentIds[boardId] || {}
		if (threadId) {
			threadId = String(threadId)
			const commentIds = threadIdCommentIds[threadId] || []
			if (commentId) {
				const index = commentIds.indexOf(commentId)
				return index >= 0
			}
			return commentIds
		}
		return threadIdCommentIds
	}
	return boardIdThreadIdCommentIds
}

export function mergeWithBoardIdThreadIdCommentIds(storage, key, data) {
	const boardIdThreadIdCommentIds = storage.get(key, {})
	for (const boardId of Object.keys(data)) {
		const threadIdCommentIds = boardIdThreadIdCommentIds[boardId]
		if (!threadIdCommentIds) {
			boardIdThreadIdCommentIds[boardId] = threadIdCommentIds = {}
		}
		for (const threadId of Object.keys(data[boardId])) {
			let commentIds = threadIdCommentIds[threadId]
			if (!commentIds) {
				threadIdCommentIds[threadId] = commentIds = []
			}
			for (const commentId of data[boardId][threadId]) {
				if (commentIds.indexOf(commentId) < 0) {
					commentIds.push(commentId)
					commentIds.sort()
				}
			}
		}
	}
	return boardIdThreadIdCommentIds
}