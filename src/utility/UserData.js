import LocalStorage from './LocalStorage'
import createByIdIndex from './createByIdIndex'

export class UserData {
	prefix = 'user.'

	data = {
		favoriteBoards: {
			type: 'list',
			expires: false
		},
		ignoredAuthors: {
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
			type: 'boards-threads-data'
		},
		watchedThreads: {
			type: 'boards-threads',
			expires: false,
			data: 'watchedThreadsInfo'
		},
		watchedThreadsInfo: {
			type: 'boards-threads-data',
			expires: false
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
			const [ addTo, removeFrom, getFrom, mergeWith ] = getFunctions(data.type)
			this[`add${capitalize(key)}`] = (...args) => addTo.apply(this, [this.storage, this.prefix + key].concat(args))
			this[`remove${capitalize(key)}`] = (...args) => {
				removeFrom.apply(this, [this.storage, this.prefix + key].concat(args))
				// Also remove from "data" key.
				if (data.data) {
					this[`remove${capitalize(data.data)}`].apply(this, args)
				}
			}
			this[`get${capitalize(key)}`] = (...args) => getFrom.apply(this, [this.storage, this.prefix + key].concat(args))
			this[`merge${capitalize(key)}`] = (...args) => mergeWith.apply(this, [this.storage, this.prefix + key].concat(args))
		}
	}

	get() {
		return Object.keys(this.data).reduce((data, key) => ({
			...data,
			[key]: this.storage.get(this.prefix + key)
		}), {})
	}

	/**
	 * Clears expired threads from user data.
	 * @param  {string} boardId
	 * @param  {object[]} threads
	 */
	updateThreads(boardId, threads) {
		const getThreadById = createByIdIndex(threads)
		for (const key of Object.keys(this.data)) {
			const data = this.data[key]
			// Babel doesn't know how to handle variables inside `case`.
			let boardsData
			let threads
			switch (data.type) {
				case 'boards-threads-comments':
				case 'boards-threads-data':
					boardsData = this.storage.get(this.prefix + key)
					if (boardsData) {
						threads = boardsData[boardId]
						if (threads) {
							let changed = false
							for (const threadId of Object.keys(threads)) {
								if (!getThreadById(threadId)) {
									if (data.expires === false) {
										// Ignore
									} else {
										delete threads[threadId]
										changed = true
									}
								}
							}
							if (changed) {
								this.storage.set(this.prefix + key, boardsData)
							}
						}
					}
					break
				case 'boards-threads':
					boardsData = this.storage.get(this.prefix + key)
					if (boardsData) {
						threads = boardsData[boardId]
						if (threads) {
							const formerThreadsCount = threads.length
							const remainingThreadIds = threads.filter(getThreadById)
							if (remainingThreadIds.length < formerThreadsCount) {
								if (data.expires === false) {
									const dataKey = data.data
									if (dataKey) {
										boardsData = this.storage.get(this.prefix + dataKey)
										if (boardsData) {
											const threadsData = boardsData[boardId]
											if (threadsData) {
												for (const expiredThreadId of threads.filter(id => !getThreadById(id))) {
													const thread = threadsData[expiredThreadId]
													if (thread) {
														thread.expired = true
													}
												}
												this.storage.set(this.prefix + dataKey, boardsData)
											}
										}
									}
								} else {
									boardsData[boardId] = remainingThreadIds
									this.storage.set(this.prefix + key, boardsData)
								}
							}
						}
					}
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

	replace(data) {
		this.clear()
		for (const key of Object.keys(data)) {
			this.storage.set(this.prefix + key, data[key])
		}
	}

	merge(data) {
		for (const key of Object.keys(data)) {
			this.storage.set(
				this.prefix + key,
				this[`merge${capitalize(key)}`](data[key])
			)
		}
	}
}

function capitalize(string) {
	return string[0].toUpperCase() + string.slice(1)
}

function getFunctions(type) {
	switch (type) {
		// ignoredAuthors: [
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
				getFromList,
				mergeWithList
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
				getFromBoardIdThreadIds,
				mergeWithBoardIdThreadIds
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
				getFromBoardIdThreadIdCommentIds,
				mergeWithBoardIdThreadIdCommentIds
			]
		// readComments: {
		//   a: {
		//   	'124': 111, // Latest read comment id.
		//   	'356': 333,
		//   	...
		//   ],
		//   ...
		// }
		case 'boards-threads-data':
			return [
				addToBoardIdThreadIdData,
				removeFromBoardIdThreadIdData,
				getFromBoardIdThreadIdData,
				mergeWithBoardIdThreadIdData
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

function mergeWithBoardIdThreadIds(storage, key, data) {
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

function addToBoardIdThreadIdData(storage, key, boardId, threadId, data) {
	const boardIdThreadIdData = storage.get(key, {})
	if (!boardIdThreadIdData[boardId]) {
		boardIdThreadIdData[boardId] = {}
	}
	threadId = String(threadId)
	boardIdThreadIdData[boardId][threadId] = data
	storage.set(key, boardIdThreadIdData)
}

function removeFromBoardIdThreadIdData(storage, key, boardId, threadId, data) {
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

function getFromBoardIdThreadIdData(storage, key, boardId, threadId, data) {
	const boardIdThreadIdData = storage.get(key, {})
	if (boardId) {
		const threadIdData = boardIdThreadIdData[boardId] || {}
		if (threadId) {
			threadId = String(threadId)
			const _commentId = threadIdData[threadId]
			if (data) {
				return _commentId === data
			}
			return _commentId
		}
		return threadIdData
	}
	return boardIdThreadIdData
}

function mergeWithBoardIdThreadIdData(storage, key, data) {
	const boardIdThreadIdData = storage.get(key, {})
	for (const boardId of Object.keys(data)) {
		const threadIdData = boardIdThreadIdData[boardId]
		if (!threadIdData) {
			boardIdThreadIdData[boardId] = threadIdData = {}
		}
		for (const threadId of Object.keys(data[boardId])) {
			const newValue = data[boardId][threadId]
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

function mergeWithBoardIdThreadIdCommentIds(storage, key, data) {
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
				}
			}
		}
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

function mergeWithList(storage, key, data) {
	const list = storage.get(key, [])
	for (const item of data) {
		if (list.indexOf(item) < 0) {
			list.push(item)
		}
	}
	return list
}

export default new UserData(new LocalStorage())