export function addToBoardIdThreadIdCommentIdData(storage, key, collection, boardId, threadId, commentId, data) {
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
	commentIdData[commentId] = encode(data, collection)
	storage.set(key, boardIdThreadIdCommentIdData)
}

export function removeFromBoardIdThreadIdCommentIdData(storage, key, collection, boardId, threadId, commentId) {
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

export function getFromBoardIdThreadIdCommentIdData(storage, key, collection, boardId, threadId, commentId) {
	const boardIdThreadIdCommentIdData = storage.get(key, {})
	if (boardId) {
		const threadIdCommentIdData = boardIdThreadIdCommentIdData[boardId] || {}
		if (threadId) {
			threadId = String(threadId)
			const commentIdData = threadIdCommentIdData[threadId] || {}
			if (commentId) {
				commentId = String(commentId)
				return decode(commentIdData[commentId], collection, 'comment')
			}
			return decode(commentIdData, collection, 'thread')
		}
		return decode(threadIdCommentIdData, collection, 'board')
	}
	return decode(boardIdThreadIdCommentIdData, collection, 'root')
}

export function mergeWithBoardIdThreadIdCommentIdData(storage, key, collection, data) {
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
				commentIdData[commentId] = encode(data[boardId][threadId][commentId], collection)
			}
		}
	}
	return boardIdThreadIdCommentIdData
}

function encode(data, collection) {
	if (collection.encode) {
		data = collection.encode(data)
	}
	return data
}

function decodeCommentData(data, collection) {
	return collection.decode(data)
}

function decodeThreadData(data, collection) {
	for (const commentId of Object.keys(data)) {
		data[commentId] = decodeCommentData(data[commentId], collection)
	}
	return data
}

function decodeBoardData(data, collection) {
	for (const threadId of Object.keys(data)) {
		decodeThreadData(data[threadId], collection)
	}
	return data
}

function decodeRootData(data, collection) {
	for (const boardId of Object.keys(data)) {
		decodeBoardData(data[boardId], collection)
	}
	return data
}

function decode(data, collection, level) {
	if (data === undefined || !collection.decode) {
		return data
	}
	switch (level) {
		case 'comment':
			return decodeCommentData(data, collection)
		case 'thread':
			return decodeThreadData(data, collection)
		case 'board':
			return decodeBoardData(data, collection)
		case 'root':
			return decodeRootData(data, collection)
		default:
			throw new Error(`Unsupported data tree level: ${level}`)
	}
}