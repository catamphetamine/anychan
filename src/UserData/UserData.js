import isEqual from 'lodash/isEqual'
import CachedLocalStorage from 'webapp-frontend/src/utility/storage/CachedLocalStorage'
import createByIdIndex from '../utility/createByIdIndex'
import { getPrefix } from '../utility/localStorage'
import migrate from './UserData.migrate'

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
} from './boardThreadComments'

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
	addToBoardIdData,
	removeFromBoardIdData,
	getFromBoardIdData,
	mergeWithBoardIdData
} from './boardData'

import {
	addToBoardIdThreadIds,
	removeFromBoardIdThreadIds,
	getFromBoardIdThreadIds,
	mergeWithBoardIdThreadIds
} from './boardThread'

// Current version of user settings.
// See `.migrate()` method comments for the changelog.
const VERSION = 1

export class UserData {
	collections = {
		// Users can add boards to the list of "Favorite boards"
		// so that they don't have to scroll through the whole
		// list of boards just to navigate to a board they visit often.
		// Example: ['a', 'b'].
		favoriteBoards: {
			type: 'list',
			isEqual: (one, two) => one.id === two.id
		},
		// Users can "ignore" all comments left by authors
		// sharing the same "author fingerprint":
		// usually a hash of IP subnet.
		// Example: ['2fde80', '4b93e1'].
		ignoredAuthors: {
			type: 'list',
			limit: 1000
		},
		// Users can hide certain comments.
		// For example, if they're offensive.
		// Example: { a: { 123: [125] } }.
		hiddenComments: {
			type: 'boards-threads-comments'
		},
		// Users can hide certain threads from being shown in "board" view.
		// For example, if their "opening comments" are offensive.
		// Example: { a: [123] }.
		hiddenThreads: {
			type: 'boards-threads'
		},
		// If a comment has been fully shown on screen
		// it's marked as "read", so that next time the user
		// goes to the thread page it shows the comments
		// starting from the first non-"read" one.
		// This way the user doesn't have to scroll to bottom
		// every time they go to a thread page.
		// Stores only the most recent "read" comment id for a thread.
		// Example: { a: { 123: 125 } }.
		latestReadComments: {
			cache: true,
			type: 'boards-threads-data',
			decode(data) {
				// Before 09.05.2020 data wasn't being encoded.
				if (data.threadUpdatedAt) {
					return data
				}
				const threadUpdatedAt = data.t * 1000
				// Could set to `undefined` but then tests wouldn't detect equality.
				delete data.t
				data.threadUpdatedAt = threadUpdatedAt
				return data
			},
			encode(data) {
				const threadUpdatedAt = data.threadUpdatedAt
				// Could set to `undefined` but then tests wouldn't detect equality.
				delete data.threadUpdatedAt
				data.t = threadUpdatedAt / 1000
				return data
			}
		},
		// If a user has seen the opening post of a thread on a board
		// while in "board" view then such thread is marked as "seen".
		// It's called "seen", not "read", because the user didn't
		// necessarily read the whole thread; they might even didn't
		// click on it to go to the thread, but they've "seen" it.
		// On a board page there's a switch: "Show all" / "Show new",
		// "new" meaning newer than the latest "seen" one.
		// Stores only the most recent "seen" thread id.
		// Example: { a: 123 }.
		latestSeenThreads: {
			cache: true,
			type: 'boards-data'
		},
		// Users can "track" certain threads.
		// "Tracked" threads are shown as a list in sidebar,
		// and they also get refreshed for new comments periodically.
		// This is an index of "tracked" threads,
		// containing just the ids of such threads.
		trackedThreads: {
			type: 'boards-threads'
		},
		// Users can "track" certain threads.
		// "Tracked" threads are shown as a list in sidebar,
		// and they also get refreshed for new comments periodically.
		// This is a full list of "tracked" threads,
		// containing all info about such threads (title, thumbnail, etc).
		trackedThreadsList: {
			type: 'threads',
			index: 'trackedThreads',
			indexKey: thread => [thread.board.id, thread.id],
			isEqual: (one, two) => one.id === two.id && one.board.id === two.board.id,
			expires: false,
			limit: 100
		},
		// User's own threads are tracked.
		// For example, so that they're highlighted in "board" view.
		ownThreads: {
			type: 'boards-threads'
		},
		// User's own comments are tracked.
		// For example, so that they're highlighted in "thread" view.
		ownComments: {
			type: 'boards-threads-comments'
		},
		// User's votes index.
		// Is used to indicate that the user "has already voted for this comment",
		// and to show whether it was an upvote or a downvote.
		commentVotes: {
			type: 'boards-threads-comments-data'
		}
	}

	constructor(storage, options = {}) {
		// // Overriding `collections` is just for testing.
		// if (options.collections) {
		// 	this.collections = options.collections
		// }
		this.storage = storage
		this.prefix = getPrefix(options.prefix)
		this.shouldMigrate = options.migrate
		// Migrate user data.
		if (this.shouldMigrate !== false) {
			const version = this.storage.get(this.prefix + 'version')
			if (version !== VERSION) {
				for (const key of Object.keys(this.collections)) {
					const data = this.storage.get(this.prefix + key)
					if (data !== undefined) {
						migrate(key, data, version)
						this.storage.set(this.prefix + key, data)
					}
				}
				this.storage.set(this.prefix + 'version', VERSION)
			}
		}
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
			if (collection.cache && this.storage.cacheKey) {
				this.storage.cacheKey(this.prefix + key)
			}
			const preArgs = [this.storage, this.prefix + key]
			const getArgs = (args) => {
				let allArgs = preArgs
				switch (collection.type) {
					case 'list':
					case 'threads':
					case 'boards-data':
					case 'boards-threads-data':
					case 'boards-threads-comments-data':
						allArgs = allArgs.concat(collection)
						break
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
				// Doesn't update "index" collection.
			}
			this[`set${capitalize(key)}`] = (...args) => {
				const [storage, key] = preArgs
				storage.set(key, args[0])
				// Doesn't update "index" collection.
			}
		}
	}

	get() {
		return Object.keys(this.collections).concat('version').reduce((data, key) => {
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

	// cache(cache) {
	// 	this.storage.cache(cache)
	// }

	/**
	 * Clears expired threads from user data.
	 * @param  {string} boardId
	 * @param  {object[]} threads
	 */
	updateThreads(boardId, threads) {
		const getThreadById = createByIdIndex(threads)
		this.onThreadsExpired(boardId, id => !getThreadById(id))
	}

	/**
	 * This function is called from `threadTracker.js`.
	 * @param  {string} boardId
	 * @param  {number} threadId
	 */
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
														comments[commentId].expiredAt = Date.now()
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
													threads[threadId].expiredAt = Date.now()
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
		// Migrate user data.
		if (this.shouldMigrate !== false) {
			migrateUserData(data)
		}
		// Clear current user data.
		this.clear()
		// Set user data.
		for (const key of Object.keys(data)) {
			this.storage.set(this.prefix + key, data[key])
		}
	}

	merge(data) {
		// Migrate user data.
		if (this.shouldMigrate !== false) {
			migrateUserData(data)
		}
		// Merge user data.
		for (const key of Object.keys(data)) {
			// A collection could have been removed
			// while the file has been laying on a disk.
			if (this.collections[key]) {
				this.storage.set(
					this.prefix + key,
					this[`merge${capitalize(key)}`](data[key])
				)
			}
		}
	}

	matchKey(key) {
		for (const key_ of Object.keys(this.collections)) {
			if (this.prefix + key_ === key) {
				return true
			}
		}
	}

	migrate() {
		const version = this.get('version', 0)
		if (version === VERSION) {
			return
		}
		this.storage.set('version', VERSION)
	}
}

function migrateUserData(data) {
	const version = data.version
	if (version !== VERSION) {
		for (const key of Object.keys(data)) {
			migrate(key, data[key], version)
		}
		data.version = VERSION
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
		// latestReadComments: {
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
		// {
		// 	a: 123,
		// 	b: 456,
		// 	...
		// }
		case 'boards-data':
			return {
				addTo: addToBoardIdData,
				removeFrom: removeFromBoardIdData,
				getFrom: getFromBoardIdData,
				mergeWith: mergeWithBoardIdData
			}
	}
}

export default new UserData(new CachedLocalStorage())

function getCount(storage, key) {
	const data = storage.get(key, {})
	return data.$$count || 0
}

function setCount(storage, key, count) {
	const data = storage.get(key, {})
	data.$$count = count
	storage.set(key, data)
}