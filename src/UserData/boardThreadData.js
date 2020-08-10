export function addToBoardIdThreadIdData(storage, key, collection, boardId, threadId, data) {
	const boardIdThreadIdData = storage.get(key, {})
	if (!boardIdThreadIdData[boardId]) {
		boardIdThreadIdData[boardId] = {}
	}
	threadId = String(threadId)
	boardIdThreadIdData[boardId][threadId] = encode(data, collection)
	storage.set(key, boardIdThreadIdData)
}

export function removeFromBoardIdThreadIdData(storage, key, collection, boardId, threadId, data) {
	const boardIdThreadIdData = storage.get(key, {})
	if (threadId) {
		const threadIdData = boardIdThreadIdData[boardId]
		if (!threadIdData) {
			return
		}
		threadId = String(threadId)
		if (data) {
			if (threadIdData[threadId] !== data) {
				return
			}
		}
		delete threadIdData[threadId]
		if (Object.keys(threadIdData).length === 0) {
			delete boardIdThreadIdData[boardId]
		}
	} else {
		delete boardIdThreadIdData[boardId]
	}
	if (Object.keys(boardIdThreadIdData).length === 0) {
		storage.delete(key)
	} else {
		storage.set(key, boardIdThreadIdData)
	}
}

export function getFromBoardIdThreadIdData(storage, key, collection, boardId, threadId, data) {
	const boardIdThreadIdData = storage.get(key, {})
	if (boardId) {
		const threadIdData = boardIdThreadIdData[boardId] || {}
		if (threadId) {
			threadId = String(threadId)
			let _data = threadIdData[threadId]
			_data = decode(_data, collection, 'thread')
			if (data) {
				return _data === data
			}
			return _data
		}
		return decode(threadIdData, collection, 'board')
	}
	return decode(boardIdThreadIdData, collection, 'root')
}

export function mergeWithBoardIdThreadIdData(storage, key, collection, data) {
	const boardIdThreadIdData = storage.get(key, {})
	for (const boardId of Object.keys(data)) {
		const threadIdData = boardIdThreadIdData[boardId]
		if (!threadIdData) {
			boardIdThreadIdData[boardId] = threadIdData = {}
		}
		for (const threadId of Object.keys(data[boardId])) {
			const newValue = encode(data[boardId][threadId], collection)
			if (threadIdData[threadId] === newValue) {
				continue
			} else if (threadIdData[threadId] === undefined) {
				threadIdData[threadId] = newValue
			} else {
				// For numbers a greater one usually means a later one.
				// For example, "latest seen thread id" or "latest read comment id".
				// So only replace the existing value if it's a number
				// and if the number is greater than the existing one.
				// In all other cases it's not determined how the merging process
				// should be performed so just skip those cases.
				if (typeof newValue === 'number') {
					if (newValue > threadIdData[threadId]) {
						threadIdData[threadId] = newValue
					}
					continue
				}
				console.warn(`No merging strategy specified for "${key}"`)
			}
		}
	}
	return boardIdThreadIdData
}

function encode(data, collection) {
	if (collection.encode) {
		data = collection.encode(data)
	}
	return data
}

function decodeThreadData(data, collection) {
	return collection.decode(data)
}

function decodeBoardData(data, collection) {
	for (const threadId of Object.keys(data)) {
		data[threadId] = decodeThreadData(data[threadId], collection)
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