import isEqual from 'lodash/isEqual'
import LocalStorage from 'webapp-frontend/src/utility/LocalStorage'
import createByIdIndex from '../utility/createByIdIndex'
import { getChan } from '../chan'

import {
	addToList,
	removeFromList,
	getFromList,
	mergeWithList,
	// setInList
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
	collections = {
		favoriteBoards: {
			type: 'list',
			isEqual: (one, two) => one.id === two.id
		},
		ignoredAuthors: {
			type: 'list',
			limit: 1000
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
		trackedThreads: {
			type: 'boards-threads'
		},
		trackedThreadsList: {
			type: 'threads',
			index: 'trackedThreads',
			indexKey: thread => [thread.board.id, thread.id],
			isEqual: (one, two) => one.id === two.id && one.board.id === two.board.id,
			expires: false,
			limit: 100
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

	constructor(storage, options = {}) {
		this.storage = storage
		this.prefix = options.prefix === undefined ?
			'captchan.' + (options.chanId ? options.chanId + '.' : '') + 'user.' :
			options.prefix
		// Create data access methods.
		for (const key of Object.keys(this.collections)) {
			const collection = this.collections[key]
			const {
				addTo,
				removeFrom,
				getFrom,
				mergeWith,
				// setIn
			} = getFunctions(collection.type)
			const preArgs = [this.storage, this.prefix + key]
			const getArgs = (args) => {
				let allArgs = preArgs
				switch (collection.type) {
					case 'list':
					case 'threads':
						allArgs = allArgs.concat(collection)
				}
				return allArgs.concat(args)
			}
			this[`add${capitalize(key)}`] = (...args) => {
				addTo.apply(this, getArgs(args))
				// Also add to "index" collection.
				if (collection.index) {
					const item = args[args.length - 1]
					this[`add${capitalize(collection.index)}`].apply(this, collection.indexKey(item))
				}
			}
			this[`remove${capitalize(key)}`] = (...args) => {
				// Also remove from "index" collection.
				if (collection.index) {
					const item = getFrom.apply(this, getArgs(args))
					if (!item) {
						return console.error(`Item "${JSON.stringify(args)}" not found in "${collection.index}"`)
					}
					this[`remove${capitalize(collection.index)}`].apply(this, collection.indexKey(item))
				}
				removeFrom.apply(this, getArgs(args))
			}
			// this[`set${capitalize(key)}`] = (...args) => {
			// 	setIn.apply(this, getArgs(args))
			// }
			this[`get${capitalize(key)}`] = (...args) => {
				return getFrom.apply(this, getArgs(args))
			}
			this[`merge${capitalize(key)}`] = (...args) => {
				return mergeWith.apply(this, getArgs(args))
			}
			this[`set${capitalize(key)}`] = (...args) => {
				const [storage, key] = preArgs
				storage.set(key, args[0])
			}
		}
	}

	get() {
		return Object.keys(this.collections).reduce((data, key) => {
			const keyData = this.storage.get(this.prefix + key)
			if (keyData === undefined) {
				return data
			}
			return {
				...data,
				[key]: keyData
			}
		}, {})
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
		this.onThreadsExpired(boardId, id => !getThreadById(id))
	}

	onThreadExpired(boardId, threadId) {
		this.onThreadsExpired(boardId, id => id === threadId)
	}

	onThreadsExpired(boardId, isThreadExpired) {
		for (const key of Object.keys(this.collections)) {
			const collection = this.collections[key]
			// Babel doesn't know how to handle variables inside `case`.
			let boardsData
			let threads
			const read = () => this.storage.get(this.prefix + key)
			const update = (value) => this.storage.set(this.prefix + key, value)
			switch (collection.type) {
				case 'boards-threads-comments-data':
				case 'boards-threads-comments':
				case 'boards-threads-data':
					boardsData = read()
					if (boardsData) {
						threads = boardsData[boardId]
						if (threads) {
							let changed = false
							for (const threadId of Object.keys(threads)) {
								if (isThreadExpired(threadId)) {
									if (collection.expires === false) {
										// Only handles `boards-threads-data` type.
										switch (collection.type) {
											case 'boards-threads-comments-data':
												const comments = threads[threadId]
												for (const commentId of Object.keys(comments)) {
													if (typeof comments[commentId] === 'object') {
														comments[commentId].expired = true
													} else {
														console.warn(`Thread ${threadId} expired but comment data is not an object`, comments[commentId])
													}
												}
												break
											case 'boards-threads-comments':
												// Ignore.
												break
											case 'boards-threads-data':
												if (typeof threads[threadId] === 'object') {
													threads[threadId].expired = true
												} else {
													console.warn(`Thread ${threadId} expired but data is not an object`, threads[threadId])
												}
												break
											default:
												console.warn(`Thread ${threadId} expired but data expiry is not implemented for type "${data.type}"`)
										}
									} else {
										delete threads[threadId]
										changed = true
									}
								}
							}
							if (changed) {
								update(boardsData)
							}
						}
					}
					break
				case 'boards-threads':
					boardsData = read()
					if (boardsData) {
						threads = boardsData[boardId]
						if (threads) {
							const formerThreadsCount = threads.length
							const remainingThreadIds = threads.filter(_ => !isThreadExpired(_))
							if (remainingThreadIds.length < formerThreadsCount) {
								boardsData[boardId] = remainingThreadIds
								update(boardsData)
							}
						}
					}
					break
				case 'threads':
					threads = read()
					if (threads) {
						const formerThreadsCount = threads.length
						const remainingThreads = threads.filter((thread) => {
							return thread.board.id !== boardId || !isThreadExpired(thread.id)
						})
						if (remainingThreads.length < formerThreadsCount) {
							if (collection.expires === false) {
								update(threads.map((thread) => {
									if (remainingThreads.indexOf(thread) >= 0) {
										return thread
									}
									return {
										...thread,
										expired: true
									}
								}))
							} else {
								update(remainingThreads)
							}
						}
					}
					break
			}
		}
	}

	clear = () => {
		for (const key of this.storage.keys()) {
			if (key.indexOf(this.prefix) === 0) {
				this.storage.delete(key)
			}
		}
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

	matchKey(key) {
		for (const key_ of Object.keys(this.collections)) {
			if (this.prefix + key_ === key) {
				return true
			}
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
		case 'threads':
			return {
				addTo: addToList,
				removeFrom: removeFromList,
				getFrom: getFromList,
				mergeWith: mergeWithList,
				// setIn: setInList
			}
		// hiddenThreads: {
		//   a: [
		//     123,
		//     ...
		//   ],
		//   ...
		// }
		case 'boards-threads':
			return {
				addTo: addToBoardIdThreadIds,
				removeFrom: removeFromBoardIdThreadIds,
				getFrom: getFromBoardIdThreadIds,
				mergeWith: mergeWithBoardIdThreadIds
			}
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
			return {
				addTo: addToBoardIdThreadIdCommentIds,
				removeFrom: removeFromBoardIdThreadIdCommentIds,
				getFrom: getFromBoardIdThreadIdCommentIds,
				mergeWith: mergeWithBoardIdThreadIdCommentIds
			}
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
			return {
				addTo: addToBoardIdThreadIdCommentIdData,
				removeFrom: removeFromBoardIdThreadIdCommentIdData,
				getFrom: getFromBoardIdThreadIdCommentIdData,
				mergeWith: mergeWithBoardIdThreadIdCommentIdData
			}
		// readComments: {
		//   a: {
		//   	'124': 111, // Latest read comment id.
		//   	'356': 333,
		//   	...
		//   ],
		//   ...
		// }
		case 'boards-threads-data':
			return {
				addTo: addToBoardIdThreadIdData,
				removeFrom: removeFromBoardIdThreadIdData,
				getFrom: getFromBoardIdThreadIdData,
				mergeWith: mergeWithBoardIdThreadIdData
			}
	}
}

export default new UserData(new LocalStorage(), {
	chanId: getChan().id
})

function getCount(storage, key) {
	const data = storage.get(key, {})
	return data.$$count || 0
}

function setCount(storage, key, count) {
	const data = storage.get(key, {})
	data.$$count = count
	storage.set(key, data)
}