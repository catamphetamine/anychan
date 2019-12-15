export function addToBoardIdData(storage, key, boardId, data) {
	const boardIdData = storage.get(key, {})
	if (!boardIdData[boardId]) {
		boardIdData[boardId] = {}
	}
	boardIdData[boardId] = data
	storage.set(key, boardIdData)
}

export function removeFromBoardIdData(storage, key, boardId, data) {
	const boardIdData = storage.get(key, {})
	if (!boardIdData[boardId]) {
		return
	}
	if (data) {
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

export function getFromBoardIdData(storage, key, boardId, data) {
	const boardIdData = storage.get(key, {})
	if (boardId) {
		const _data = boardIdData[boardId]
		if (data) {
			return _data === data
		}
		return _data
	}
	return boardIdData
}

export function mergeWithBoardIdData(storage, key, data) {
	const boardIdData = storage.get(key, {})
	for (const boardId of Object.keys(data)) {
		const newValue = data[boardId]
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