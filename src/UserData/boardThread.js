export function addToBoardIdThreadIds(storage, key, boardId, threadId) {
	const threadIdsByBoardId = storage.get(key, {})
	if (!threadIdsByBoardId[boardId]) {
		threadIdsByBoardId[boardId] = []
	}
	const index = threadIdsByBoardId[boardId].indexOf(threadId)
	if (index < 0) {
		threadIdsByBoardId[boardId].push(threadId)
		storage.set(key, threadIdsByBoardId)
	}
}

export function removeFromBoardIdThreadIds(storage, key, boardId, threadId) {
	const threadIdsByBoardId = storage.get(key)
	if (!threadIdsByBoardId) {
		return
	}
	if (!threadIdsByBoardId[boardId]) {
		return
	}
	if (threadId) {
		const index = threadIdsByBoardId[boardId].indexOf(threadId)
		if (index < 0) {
			return
		}
		threadIdsByBoardId[boardId].splice(index, 1)
		if (threadIdsByBoardId[boardId].length === 0) {
			delete threadIdsByBoardId[boardId]
		}
	} else {
		delete threadIdsByBoardId[boardId]
	}
	if (Object.keys(threadIdsByBoardId).length === 0) {
		storage.delete(key)
	} else {
		storage.set(key, threadIdsByBoardId)
	}
}

export function getFromBoardIdThreadIds(storage, key, boardId, threadId) {
	const threadIdsByBoardId = storage.get(key, {})
	if (boardId) {
		const threadIds = threadIdsByBoardId[boardId] || []
		if (threadId) {
			const index = threadIds.indexOf(threadId)
			return index >= 0
		}
		return threadIds
	}
	return threadIdsByBoardId
}

export function mergeWithBoardIdThreadIds(storage, key, data) {
	const boardIdThreadIds = storage.get(key, {})
	for (const boardId of Object.keys(data)) {
		const threadIds = boardIdThreadIds[boardId]
		if (!threadIds) {
			boardIdThreadIds[boardId] = threadIds = []
		}
		for (const threadId of data[boardId]) {
			if (threadIds.indexOf(threadId) < 0) {
				threadIds.push(threadId)
			}
		}
	}
	return boardIdThreadIds
}