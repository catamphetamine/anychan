import LocalStorage from '../utility/LocalStorage'
import createByIdIndex from '../utility/createByIdIndex'

import {
	addToList,
	removeFromList,
	getFromList,
	mergeWithList
} from './list'

import {
	addToBoardIdThreadIdCommentIds,
	removeFromBoardIdThreadIdCommentIds,
	getFromBoardIdThreadIdCommentIds,
	mergeWithBoardIdThreadIdCommentIds
} from './boardThreadComment'

import {
	addToBoardIdThreadIdCommentIdData,
	removeFromBoardIdThreadIdCommentIdData,
	getFromBoardIdThreadIdCommentIdData,
	mergeWithBoardIdThreadIdCommentIdData
} from './boardThreadCommentData'

import {
	addToBoardIdThreadIdData,
	removeFromBoardIdThreadIdData,
	getFromBoardIdThreadIdData,
	mergeWithBoardIdThreadIdData
} from './boardThreadData'

import {
	addToBoardIdThreadIds,
	removeFromBoardIdThreadIds,
	getFromBoardIdThreadIds,
	mergeWithBoardIdThreadIds
} from './boardThread'

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
		commentVotes: {
			type: 'boards-threads-comments-data'
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

	cache(cache) {
		this.storage.cache(cache)
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
				case 'boards-threads-comments-data':
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
		// commentVotes: {
		//   a: {
		//     '123': {
		//       '123': 1,
		//       '124': -1,
		//       ...
		//     },
		//     ...
		//   },
		//   ...
		// }
		case 'boards-threads-comments-data':
			return [
				addToBoardIdThreadIdCommentIdData,
				removeFromBoardIdThreadIdCommentIdData,
				getFromBoardIdThreadIdCommentIdData,
				mergeWithBoardIdThreadIdCommentIdData
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

export default new UserData(new LocalStorage())