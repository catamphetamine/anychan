export function addToBoardIdThreadIdCommentIdData(storage, key, boardId, threadId, commentId, data) {
	const boardIdThreadIdCommentIdData = storage.get(key, {})
	let threadIdCommentIdData = boardIdThreadIdCommentIdData[boardId]
	if (!threadIdCommentIdData) {
		boardIdThreadIdCommentIdData[boardId] = threadIdCommentIdData = {}
	}
	threadId = String(threadId)
	let commentIdData = threadIdCommentIdData[threadId]
	if (!commentIdData) {
		threadIdCommentIdData[threadId] = commentIdData = {}
	}
	commentId = String(commentId)
	commentIdData[commentId] = data
	storage.set(key, boardIdThreadIdCommentIdData)
}

export function removeFromBoardIdThreadIdCommentIdData(storage, key, boardId, threadId, commentId) {
	let boardIdThreadIdCommentIdData = storage.get(key)
	if (!boardIdThreadIdCommentIdData) {
		return
	}
	if (threadId) {
		const threadIdCommentIdData = boardIdThreadIdCommentIdData[boardId]
		if (!threadIdCommentIdData) {
			return
		}
		threadId = String(threadId)
		if (commentId) {
			const commentIdData = threadIdCommentIdData[threadId]
			if (!commentIdData) {
				return
			}
			commentId = String(commentId)
			if (!commentIdData.hasOwnProperty(commentId)) {
				return
			}
			delete commentIdData[commentId]
			if (Object.keys(commentIdData).length === 0) {
				delete threadIdCommentIdData[threadId]
			}
		} else {
			delete threadIdCommentIdData[threadId]
		}
		if (Object.keys(threadIdCommentIdData).length === 0) {
			delete boardIdThreadIdCommentIdData[boardId]
		}
	} else {
		delete boardIdThreadIdCommentIdData[boardId]
	}
	if (Object.keys(boardIdThreadIdCommentIdData).length === 0) {
		storage.delete(key)
	} else {
		storage.set(key, boardIdThreadIdCommentIdData)
	}
}

export function getFromBoardIdThreadIdCommentIdData(storage, key, boardId, threadId, commentId) {
	const boardIdThreadIdCommentIdData = storage.get(key, {})
	if (boardId) {
		const threadIdCommentIdData = boardIdThreadIdCommentIdData[boardId] || {}
		if (threadId) {
			threadId = String(threadId)
			const commentIdData = threadIdCommentIdData[threadId] || {}
			if (commentId) {
				commentId = String(commentId)
				return commentIdData[commentId]
			}
			return commentIdData
		}
		return threadIdCommentIdData
	}
	return boardIdThreadIdCommentIdData
}

export function mergeWithBoardIdThreadIdCommentIdData(storage, key, data) {
	const boardIdThreadIdCommentIdData = storage.get(key, {})
	for (const boardId of Object.keys(data)) {
		const threadIdCommentIdData = boardIdThreadIdCommentIdData[boardId]
		if (!threadIdCommentIdData) {
			boardIdThreadIdCommentIdData[boardId] = threadIdCommentIdData = {}
		}
		for (const threadId of Object.keys(data[boardId])) {
			let commentIdData = threadIdCommentIdData[threadId]
			if (!commentIdData) {
				threadIdCommentIdData[threadId] = commentIdData = {}
			}
			for (const commentId of Object.keys(data[boardId][threadId])) {
				commentIdData[commentId] = mergeData(
					commentIdData[commentId],
					data[boardId][threadId][commentId]
				)
			}
		}
	}
	return boardIdThreadIdCommentIdData
}

export function mergeData(previousData, newData) {
	if (previousData === undefined) {
		return newData
	}
	if (newData === undefined) {
		return previousData
	}
	if (typeof newData === 'object') {
		return {
			...previousData,
			...newData
		}
	}
	return newData
}