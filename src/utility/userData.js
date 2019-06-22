import {
	getObject,
	setObject,
	deleteObject,
	forEach as forEachLocalStorage
} from 'webapp-frontend/src/utility/localStorage'

export class UserData {
	prefix = 'userData.'
	data = {
		favoriteBoards: {
			type: 'list',
			expires: false
		},
		hiddenAuthors: {
			type: 'list',
			expires: false
		},
		hiddenComments: {
			type: 'boards-threads-comments'
		},
		hiddenThreads: {
			type: 'boards-threads'
		},
		readComments: {
			type: 'boards-threads-comment'
		},
		watchedThreads: {
			type: 'boards-threads'
		},
		ownThreads: {
			type: 'boards-threads'
		},
		ownComments: {
			type: 'boards-threads-comments'
		},
		upvotedComments: {
			type: 'boards-threads-comments'
		},
		downvotedComments: {
			type: 'boards-threads-comments'
		}
	}

	constructor(storage) {
		this.storage = storage
		// Create data access methods.
		for (const key of Object.keys(this.data)) {
			const data = this.data[key]
			const [ addTo, removeFrom, getFrom ] = getFunctions(data.type)
			this[`add${capitalize(key)}`] = (...args) => addTo.apply(this, [this.storage, this.prefix + key].concat(args))
			this[`remove${capitalize(key)}`] = (...args) => removeFrom.apply(this, [this.storage, this.prefix + key].concat(args))
			this[`get${capitalize(key)}`] = (...args) => getFrom.apply(this, [this.storage, this.prefix + key].concat(args))
		}
	}

	onThreadExpire(boardId, threadId) {
		for (const key of Object.keys(this.data)) {
			const data = this.data[key]
			switch (data.type) {
				case 'boards-threads-comments':
				case 'boards-threads-comment':
				case 'boards-threads':
					this[`remove${capitalize(key)}`](boardId, threadId)
					break
			}
		}
	}

	clear = () => {
		this.storage.forEach((key) => {
			if (key.indexOf(this.prefix) === 0) {
				this.storage.delete(key)
			}
		})
	}
}

function capitalize(string) {
	return string[0].toUpperCase() + string.slice(1)
}

function getFunctions(type) {
	switch (type) {
		// hiddenAuthors: [
		//   'a0dbf7',
		//   ...
		// ]
		// favoriteBoards: [
		//   'a',
		//   'b'
		// ]
		case 'list':
			return [
				addToList,
				removeFromList,
				getFromList
			]
		// hiddenThreads: {
		//   a: [
		//     123,
		//     ...
		//   ],
		//   ...
		// }
		case 'boards-threads':
			return [
				addToBoardIdThreadIds,
				removeFromBoardIdThreadIds,
				getFromBoardIdThreadIds
			]
		// hiddenComments: {
		//   a: {
		//     '123': [
		//       124,
		//       125,
		//       ...
		//     ],
		//     ...
		//   },
		//   ...
		// }
		case 'boards-threads-comments':
			return [
				addToBoardIdThreadIdCommentIds,
				removeFromBoardIdThreadIdCommentIds,
				getFromBoardIdThreadIdCommentIds
			]
		// readComments: {
		//   a: {
		//   	'124': 111, // Latest read comment id.
		//   	'356': 333,
		//   	...
		//   ],
		//   ...
		// }
		case 'boards-threads-comment':
			return [
				addToBoardIdThreadIdCommentId,
				removeFromBoardIdThreadIdCommentId,
				getFromBoardIdThreadIdCommentId
			]
	}
}

function addToBoardIdThreadIds(storage, key, boardId, threadId) {
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

function removeFromBoardIdThreadIds(storage, key, boardId, threadId) {
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

function getFromBoardIdThreadIds(storage, key, boardId, threadId) {
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

function addToBoardIdThreadIdCommentId(storage, key, boardId, threadId, commentId) {
	const boardIdThreadIdCommentId = storage.get(key, {})
	if (!boardIdThreadIdCommentId[boardId]) {
		boardIdThreadIdCommentId[boardId] = {}
	}
	threadId = String(threadId)
	boardIdThreadIdCommentId[boardId][threadId] = commentId
	storage.set(key, boardIdThreadIdCommentId)
}

function removeFromBoardIdThreadIdCommentId(storage, key, boardId, threadId, commentId) {
	const boardIdThreadIdCommentId = storage.get(key, {})
	if (threadId) {
		const threadIdCommentId = boardIdThreadIdCommentId[boardId]
		if (!threadIdCommentId) {
			return
		}
		threadId = String(threadId)
		if (commentId) {
			if (threadIdCommentId[threadId] !== commentId) {
				return
			}
		}
		delete threadIdCommentId[threadId]
		if (Object.keys(threadIdCommentId).length === 0) {
			delete boardIdThreadIdCommentId[boardId]
		}
	} else {
		delete boardIdThreadIdCommentId[boardId]
	}
	if (Object.keys(boardIdThreadIdCommentId).length === 0) {
		storage.delete(key)
	} else {
		storage.set(key, boardIdThreadIdCommentId)
	}
}

function getFromBoardIdThreadIdCommentId(storage, key, boardId, threadId, commentId) {
	const boardIdThreadIdCommentId = storage.get(key, {})
	if (boardId) {
		const threadIdCommentId = boardIdThreadIdCommentId[boardId] || {}
		if (threadId) {
			threadId = String(threadId)
			const _commentId = threadIdCommentId[threadId]
			if (commentId) {
				return _commentId === commentId
			}
			return _commentId
		}
		return threadIdCommentId
	}
	return boardIdThreadIdCommentId
}

function addToBoardIdThreadIdCommentIds(storage, key, boardId, threadId, commentId) {
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
		storage.set(key, boardIdThreadIdCommentIds)
	}
}

function removeFromBoardIdThreadIdCommentIds(storage, key, boardId, threadId, commentId) {
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

function getFromBoardIdThreadIdCommentIds(storage, key, boardId, threadId, commentId) {
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

function addToList(storage, key, item) {
	const list = storage.get(key, [])
	const index = list.indexOf(item)
	if (index < 0) {
		list.push(item)
		storage.set(key, list)
	}
}

function removeFromList(storage, key, item) {
	const list = storage.get(key)
	if (!list) {
		return
	}
	const index = list.indexOf(item)
	if (index < 0) {
		return
	}
	list.splice(index, 1)
	if (list.length === 0) {
		storage.delete(key)
	} else {
		storage.set(key, list)
	}
}

function getFromList(storage, key, item) {
	const list = storage.get(key, [])
	if (item) {
		const index = list.indexOf(item)
		return index >= 0
	}
	return list
}

export class LocalStorage {
	get(key, defaultValue) {
		return getObject(key, defaultValue)
	}
	set(key, value) {
		return setObject(key, value)
	}
	delete(key) {
		return deleteObject(key)
	}
	forEach(func) {
		forEachLocalStorage(func)
	}
}

export class MemoryStorage {
	data = {}
	get(key, defaultValue) {
		return this.data[key] || defaultValue
	}
	set(key, value) {
		this.data[key] = value
	}
	delete(key) {
		delete this.data[key]
	}
	// `clear()` is only used for tests.
	clear() {
		this.data = {}
	}
	forEach(func) {
		for (const key of Object.keys(this.data)) {
			func(key)
		}
	}
}

export default new UserData(new LocalStorage())