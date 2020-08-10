export function addToBoardIdData(storage, key, collection, boardId, data) {
	const boardIdData = storage.get(key, {})
	if (!boardIdData[boardId]) {
		boardIdData[boardId] = {}
	}
	boardIdData[boardId] = encode(data, collection)
	storage.set(key, boardIdData)
}

export function removeFromBoardIdData(storage, key, collection, boardId, data) {
	const boardIdData = storage.get(key, {})
	if (!boardIdData[boardId]) {
		return
	}
	if (data) {
		data = encode(data, collection, 'board')
		if (boardIdData[boardId] !== data) {
			return
		}
	}
	delete boardIdData[boardId]
	if (Object.keys(boardIdData).length === 0) {
		storage.delete(key)
	} else {
		storage.set(key, boardIdData)
	}
}

export function getFromBoardIdData(storage, key, collection, boardId, data) {
	const boardIdData = storage.get(key, {})
	if (boardId) {
		const _data = decode(boardIdData[boardId], collection, 'board')
		if (data) {
			return _data === data
		}
		return _data
	}
	return decode(boardIdData, collection, 'root')
}

export function mergeWithBoardIdData(storage, key, collection, data) {
	const boardIdData = storage.get(key, {})
	for (const boardId of Object.keys(data)) {
		const newValue = encode(data[boardId], collection)
		if (boardIdData[boardId] === newValue) {
			continue
		} else if (boardIdData[boardId] === undefined) {
			boardIdData[boardId] = newValue
		} else {
			// For numbers a greater one usually means a later one.
			// For example, "latest seen thread id" or "latest read comment id".
			// So only replace the existing value if it's a number
			// and if the number is greater than the existing one.
			// In all other cases it's not determined how the merging process
			// should be performed so just skip those cases.
			if (typeof newValue === 'number') {
				if (newValue > boardIdData[boardId]) {
					boardIdData[boardId] = newValue
				}
				continue
			}
			console.warn(`No merging strategy specified for "${key}"`)
		}
	}
	return boardIdData
}

function encode(data, collection) {
	if (collection.encode) {
		data = collection.encode(data)
	}
	return data
}

function decodeBoardData(data, collection) {
	return collection.decode(data)
}

function decodeRootData(data, collection) {
	for (const boardId of Object.keys(data)) {
		data[boardId] = decodeBoardData(data[boardId], collection)
	}
	return data
}

function decode(data, collection, level) {
	if (data === undefined || !collection.decode) {
		return data
	}
	switch (level) {
		case 'board':
			return decodeBoardData(data, collection)
		case 'root':
			return decodeRootData(data, collection)
		default:
			throw new Error(`Unsupported data tree level: ${level}`)
	}
}