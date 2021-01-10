import isEqual from 'lodash/isEqual'
import CachedLocalStorage from 'webapp-frontend/src/utility/storage/CachedLocalStorage'
import createByIdIndex from '../utility/createByIdIndex'
import { getPrefix } from '../utility/localStorage'
import migrate, { migrateCollectionData } from './UserData.migrate'

import {
	// setValue,
	removeValue,
	getValue,
	mergeValue
} from './value'

import {
	addToList,
	removeFromList,
	getFromList,
	mergeWithList,
	setInList
} from './list'

import {
	addToChannelIdThreadIdCommentIds,
	removeFromChannelIdThreadIdCommentIds,
	getFromChannelIdThreadIdCommentIds,
	mergeWithChannelIdThreadIdCommentIds
} from './channelThreadComments'

import {
	setChannelIdThreadIdCommentIdData,
	removeChannelIdThreadIdCommentIdData,
	getChannelIdThreadIdCommentIdData,
	mergeChannelIdThreadIdCommentIdData
} from './channelThreadCommentData'

import {
	setChannelIdThreadIdData,
	removeChannelIdThreadIdData,
	getChannelIdThreadIdData,
	mergeChannelIdThreadIdData
} from './channelThreadData'

import {
	setChannelIdData,
	removeChannelIdData,
	getChannelIdData,
	mergeChannelIdData
} from './channelData'

import {
	addToChannelIdThreadIds,
	removeFromChannelIdThreadIds,
	getFromChannelIdThreadIds,
	mergeWithChannelIdThreadIds
} from './channelThread'

// Current version of user data.
// See `UserData.migrate.js` comments for the changelog.
const VERSION = 3

const OPERATIONS = {
	get: 'get',
	add: 'add',
	set: 'set',
	setIn: 'setIn',
	remove: 'remove',
	merge: 'merge'
}

export const TRACKED_THREADS_INDEX_COLLECTION_NAME = 'trackedThreads'

export class UserData {
	collections = {
		// Users can add channels to the list of "Favorite channels"
		// so that they don't have to scroll through the whole
		// list of channels just to navigate to a channel they visit often.
		// Example: ['a', 'b'].
		favoriteChannels: {
			type: 'list',
			isEqual: (one, two) => one.id === two.id,
			alias: {
				add: 'addFavoriteChannel',
				remove: 'removeFavoriteChannel'
			}
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
			type: 'channels-threads-comments'
		},
		// Users can hide certain threads from being shown on a channel page.
		// For example, if their "opening comments" are offensive.
		// Example: { a: [123] }.
		hiddenThreads: {
			type: 'channels-threads'
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
			// Cache the changes to this collection
			// and don't flush them to disk immediately
			// to prevent several disk writes per second.
			// Chrome seems to cache writes to `localStorage` anyway.
			cache: true,
			type: 'channels-threads-data',
			compare: (a, b) => a.id > b.id ? 1 : (a.id === b.id ? 0 : -1),
			decode(data) {
				// Decode `threadUpdatedAt` property.
				//
				// Before 09.05.2020 data wasn't being encoded.
				// That "previous" data contained `threadUpdatedAt` timestamp
				// as is, without being minimized to `t` seconds.
				//
				// `threadUpdatedAt` property was added at some point,
				// but then it was discarded due to not being used.
				// Maybe it could be re-added in some future,
				// so not removing the code for now.
				//
				if (data.t !== undefined) {
					data.threadUpdatedAt = data.t * 1000
					// Could set to `undefined` but then the tests wouldn't detect equality.
					delete data.t
				}
				// Result.
				return data
			},
			encode(data) {
				// Encode `threadUpdatedAt` property.
				//
				// `threadUpdatedAt` property was added at some point,
				// but then it was discarded due to not being used.
				// Maybe it could be re-added in some future,
				// so not removing the code for now.
				//
				if (data.threadUpdatedAt !== undefined) {
					data.t = data.threadUpdatedAt / 1000
					// Could set to `undefined` but then the tests wouldn't detect equality.
					delete data.threadUpdatedAt
				}
				// Result.
				return data
			},
			alias: {
				get: 'getLatestReadComment',
				set: 'setLatestReadComment',
				remove: 'removeLatestReadComment'
			}
		},
		// If a user has seen the opening post of a thread on a channel
		// on a channel page then such thread is marked as "seen".
		// It's called "seen", not "read", because the user didn't
		// necessarily read the whole thread; they might even didn't
		// click on it to go to the thread, but they've "seen" it.
		// On a channel page there's a switch: "Show all" / "Show new",
		// "new" meaning newer than the latest "seen" one.
		// Stores only the most recent "seen" thread id.
		// Example: { a: 123 }.
		latestSeenThreads: {
			// Cache the changes to this collection
			// and don't flush them to disk immediately
			// to prevent several disk writes per second.
			// Chrome seems to cache writes to `localStorage` anyway.
			cache: true,
			type: 'channels-data',
			alias: {
				get: 'getLatestSeenThread',
				set: 'setLatestSeenThread'
			}
		},
		// Users can "track" certain threads.
		// "Tracked" threads are shown as a list in sidebar,
		// and they also get refreshed for new comments periodically.
		// This is an index of "tracked" threads,
		// containing just the ids of such threads.
		[TRACKED_THREADS_INDEX_COLLECTION_NAME]: {
			type: 'channels-threads',
			alias: {
				get: 'isTrackedThread'
			}
		},
		// Users can "track" certain threads.
		// "Tracked" threads are shown as a list in sidebar,
		// and they also get refreshed for new comments periodically.
		// This is a full list of "tracked" threads,
		// containing all info about such threads (title, thumbnail, etc).
		trackedThreadsList: {
			type: 'threads',
			index: 'trackedThreads',
			indexKey: thread => [thread.channel.id, thread.id],
			isEqual: (one, two) => one.id === two.id && one.channel.id === two.channel.id,
			// When a thread expires, don't remove it from `trackedThreadsList`.
			// This way, a thread would still be present in the sidebar,
			// only marked as expired.
			expires: false,
			limit: 100,
			alias: {
				get: {
					name: 'getTrackedThread',
					create: (get) => (...args) => {
						if (typeof args[0] === 'string') {
							const channelId = args.shift()
							const threadId = args.shift()
							args.unshift({
								id: threadId,
								channel: {
									id: channelId
								}
							})
						}
						return get.apply(this, args)
					}
				},
				setIn: 'updateTrackedThread',
				add: 'addTrackedThread',
				remove: 'removeTrackedThread'
			}
		},
		// User's own threads are tracked.
		// For example, so that they're highlighted on a channel page.
		ownThreads: {
			type: 'channels-threads'
		},
		// User's own comments are tracked.
		// For example, so that they're highlighted in "thread" view.
		ownComments: {
			type: 'channels-threads-comments'
		},
		// User's votes index.
		// Is used to indicate that the user "has already voted for this comment",
		// and to show whether it was an upvote or a downvote.
		commentVotes: {
			type: 'channels-threads-comments-data',
			alias: {
				get: 'getCommentVote',
				set: 'setCommentVote',
				remove: 'removeCommentVote'
			}
		},
		// The latest announcement.
		// When it's read, it's marked as `read: true`.
		announcement: {
			type: 'value'
		},
		// The latest announcement refresh timestamp.
		announcementRefreshedAt: {
			type: 'value'
		},
		// Announcement refresh lock timestamp.
		announcementRefreshLockedUntil: {
			type: 'value'
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
				const getCollectionData = (key) => {
					return this.storage.get(this.prefix + key)
				}
				const setCollectionData = (key, collectionData) => {
					this.storage.set(this.prefix + key, collectionData)
				}
				const removeCollection = (key) => {
					this.storage.delete(this.prefix + key)
				}
				migrate({
					getCollectionData,
					setCollectionData,
					removeCollection,
					version
				})
				for (const key of Object.keys(this.collections)) {
					const data = getCollectionData(key)
					if (data !== undefined) {
						migrateCollectionData({
							key,
							data,
							version
						})
						setCollectionData(key, data)
					}
				}
				this.storage.set(this.prefix + 'version', VERSION)
			}
		}
		// Create data access methods.
		for (const key of Object.keys(this.collections)) {
			const collection = this.collections[key]
			const {
				get,
				add,
				set,
				setIn,
				remove,
				merge
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
					case 'channels-data':
					case 'channels-threads-data':
					case 'channels-threads-comments-data':
						allArgs = allArgs.concat(collection)
						break
				}
				return allArgs.concat(args)
			}
			this[`${OPERATIONS.get}${capitalize(key)}`] = (...args) => {
				return get.apply(this, getArgs(args))
			}
			if (add) {
				this[`${OPERATIONS.add}${capitalize(key)}`] = (...args) => {
					add.apply(this, getArgs(args))
					// Also add to "index" collection.
					if (collection.index) {
						const item = args[args.length - 1]
						this[`${OPERATIONS.add}${capitalize(collection.index)}`].apply(this, collection.indexKey(item))
					}
				}
			}
			this[`${OPERATIONS.set}${capitalize(key)}`] = (...args) => {
				if (args.length === 0) {
					const value = args[0]
					const [storage, key] = preArgs
					storage.set(key, value)
					// Doesn't update the related "index" collection.
					// For example, if something like "trackedThreadsList" would be "set"
					// "from scratch", then "trackedThreads" index collection wouldn't be updated.
				} else if (set) {
					set.apply(this, getArgs(args))
					// Doesn't update the related "index" collection.
					// For example, if something like "trackedThreadsList" would be "set"
					// "from scratch", then "trackedThreads" index collection wouldn't be updated.
				}
			}
			if (setIn) {
				this[`${OPERATIONS.setIn}${capitalize(key)}`] = (...args) => {
					setIn.apply(this, getArgs(args))
				}
			}
			this[`${OPERATIONS.remove}${capitalize(key)}`] = (...args) => {
				const item = get.apply(this, getArgs(args))
				if (!item) {
					// console.error(`Item "${JSON.stringify(args)}" not found in "${collection.index}"`)
					return
				}
				// Also remove from the related "index" collection.
				if (collection.index) {
					this[`${OPERATIONS.remove}${capitalize(collection.index)}`].apply(this, collection.indexKey(item))
				}
				remove.apply(this, getArgs(args))
			}
			this[`${OPERATIONS.merge}${capitalize(key)}`] = (...args) => {
				return merge.apply(this, getArgs(args))
				// Doesn't update "index" collection.
			}
		}
		// Add method aliases.
		for (const key of Object.keys(this.collections)) {
			const collection = this.collections[key]
			if (collection.alias) {
				for (const operation of Object.keys(OPERATIONS)) {
					if (collection.alias[operation]) {
						alias.call(this, operation, collection.alias[operation], key)
					}
				}
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
	 * Updates thread-related collections if they reference
	 * some of the threads that have expired.
	 * @param  {string} channelId
	 * @param  {object[]} threads
	 * @return {string[]} Returns updated collections' names.
	 */
	clearExpiredThreads(channelId, threads) {
		const getThreadById = createByIdIndex(threads)
		return this.onThreadsExpired(channelId, id => !getThreadById(id))
	}

	/**
	 * Updates thread-related collections if they reference
	 * some the thread that has expired.
	 * @param  {string} channelId
	 * @param  {number} threadId
	 * @return {string[]} Returns updated collections' names.
	 */
	onThreadExpired(channelId, threadId) {
		return this.onThreadsExpired(channelId, id => id === threadId)
	}

	/**
	 * Updates thread-related collections if they reference
	 * some of the threads that have expired.
	 * @param  {string} channelId
	 * @param  {function} isThreadExpired — A function of thread id. Returns `true` if the thread has expired.
	 * @return {string[]} Returns updated collections' names.
	 */
	onThreadsExpired(channelId, isThreadExpired) {
		const updatedCollections = []
		for (const key of Object.keys(this.collections)) {
			const collection = this.collections[key]
			// Babel doesn't know how to handle variables inside `case`.
			let channelsData
			let threads
			const read = () => this.storage.get(this.prefix + key)
			const update = (value) => this.storage.set(this.prefix + key, value)
			switch (collection.type) {
				case 'channels-threads-comments-data':
				case 'channels-threads-comments':
				case 'channels-threads-data':
					channelsData = read()
					if (channelsData) {
						threads = channelsData[channelId]
						if (threads) {
							let changed = false
							for (const threadId of Object.keys(threads)) {
								if (isThreadExpired(threadId)) {
									if (collection.expires === false) {
										// Only handles `channels-threads-data` type.
										switch (collection.type) {
											case 'channels-threads-comments-data':
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
											case 'channels-threads-comments':
												// Ignore.
												break
											case 'channels-threads-data':
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
										if (Object.keys(threads).length === 0) {
											delete channelsData[channelId]
										}
										changed = true
									}
								}
							}
							if (changed) {
								update(channelsData)
								updatedCollections.push(key)
							}
						}
					}
					break
				case 'channels-threads':
					channelsData = read()
					if (channelsData) {
						threads = channelsData[channelId]
						if (threads) {
							const formerThreadsCount = threads.length
							const remainingThreadIds = threads.filter(_ => !isThreadExpired(_))
							if (remainingThreadIds.length < formerThreadsCount) {
								if (remainingThreadIds.length === 0) {
									delete channelsData[channelId]
								} else {
									channelsData[channelId] = remainingThreadIds
								}
								update(channelsData)
								updatedCollections.push(key)
							}
						}
					}
					break
				case 'threads':
					threads = read()
					if (threads) {
						const formerThreadsCount = threads.length
						const remainingThreads = threads.filter((thread) => {
							return thread.channel.id !== channelId || !isThreadExpired(thread.id)
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
							updatedCollections.push(key)
						}
					}
					break
			}
		}
		return updatedCollections
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
}

function migrateUserData(data) {
	const version = data.version
	if (version !== VERSION) {
		migrate({
			getCollectionData(key) {
				return data[key]
			},
			setCollectionData(key, collectionData) {
				data[key] = collectionData
			},
			removeCollection(key) {
				delete data[key]
			},
			version
		})
		for (const key of Object.keys(data)) {
			migrateCollectionData({
				key,
				data: data[key],
				version
			})
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
		// favoriteChannels: [
		//   'a',
		//   'b'
		// ]
		case 'value':
			return {
				get: getValue,
				remove: removeValue,
				merge: mergeValue
			}
		case 'list':
		case 'threads':
			return {
				add: addToList,
				get: getFromList,
				setIn: setInList,
				remove: removeFromList,
				merge: mergeWithList
			}
		// hiddenThreads: {
		//   a: [
		//     123,
		//     ...
		//   ],
		//   ...
		// }
		case 'channels-threads':
			return {
				add: addToChannelIdThreadIds,
				remove: removeFromChannelIdThreadIds,
				get: getFromChannelIdThreadIds,
				merge: mergeWithChannelIdThreadIds
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
		case 'channels-threads-comments':
			return {
				add: addToChannelIdThreadIdCommentIds,
				remove: removeFromChannelIdThreadIdCommentIds,
				get: getFromChannelIdThreadIdCommentIds,
				merge: mergeWithChannelIdThreadIdCommentIds
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
		case 'channels-threads-comments-data':
			return {
				set: setChannelIdThreadIdCommentIdData,
				remove: removeChannelIdThreadIdCommentIdData,
				get: getChannelIdThreadIdCommentIdData,
				merge: mergeChannelIdThreadIdCommentIdData
			}
		// latestReadComments: {
		//   a: {
		//   	'124': 111, // Latest read comment id.
		//   	'356': 333,
		//   	...
		//   ],
		//   ...
		// }
		case 'channels-threads-data':
			return {
				set: setChannelIdThreadIdData,
				remove: removeChannelIdThreadIdData,
				get: getChannelIdThreadIdData,
				merge: mergeChannelIdThreadIdData
			}
		// {
		// 	a: 123,
		// 	b: 456,
		// 	...
		// }
		case 'channels-data':
			return {
				set: setChannelIdData,
				remove: removeChannelIdData,
				get: getChannelIdData,
				merge: mergeChannelIdData
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

function alias(operation, alias, key) {
	let aliasName
	let func = this[OPERATIONS[operation] + capitalize(key)]
	if (typeof alias === 'string') {
		aliasName = alias
	} else {
		aliasName = alias.name
		if (alias.create) {
			func = alias.create(func)
		}
	}
	if (this[aliasName]) {
		throw new Error(`"${aliasName}" method already exists on UserData`)
	}
	this[aliasName] = func
}