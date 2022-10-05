import { encodeTimestamp } from './compression'

import {
	ARCHIVE_PREFIX,
	ARCHIVE_COLLECTIONS,
	ARCHIVED_THREADS_ACCESSED_AT_COLLECTION,
	ARCHIVED_THREADS_ACCESSED_AT_COLLECTION_NAME,
	SUBSCRIBED_THREADS_INDEX_COLLECTION_NAME,
	SUBSCRIBED_THREADS_COLLECTION_NAME
} from './collections'

import isObject from '../utility/isObject'

/**
 * Updates thread-related collections if they reference
 * some of the threads that have expired or have been archived.
 * For example, clears stuff like latest read comment IDs of expired threads, etc.
 * @param  {string} options.channelId
 * @param  {function} options.isArchived — A function of (numeric) thread id. Returns `true` if the thread has been archived.
 * @param  {function} options.hasExpired — A function of (numeric) thread id. Returns `true` if the thread has expired.
 * @return {object} `{ subscribedThreadsArchivedOrExpired: boolean }`
 */
export default function onThreadsArchivedOrExpired({
	channelId,
	isArchived: _isArchived,
	hasExpired: _hasExpired
}, {
	now,
	// hasArchive,
	collections,
	read: _read,
	write: _write
}) {
	const updatedCollections = []
	// Tracks archived and expired thread IDs.
	const [isArchived, addArchivedThreads] = trackArchivedThreads(_isArchived, _read, _write, channelId, now)
	const [hasExpired, removeExpiredThreads] = trackExpiredThreads(_hasExpired, _read, _write, channelId, now, collections)
	for (const key of Object.keys(collections)) {
		const collection = collections[key]
		if (!isSupportedCollectionType(collection.type)) {
			continue
		}
		// `read()` returns non-decoded collection data.
		const read = () => _read(key)
		const write = (value) => _write(key, value)
		const readArchive = () => _read(ARCHIVE_PREFIX + key)
		const writeArchive = (value) => _write(ARCHIVE_PREFIX + key, value)
		const data = read()
		if (!data) {
			continue
		}
		const operator = getOperator(collection.type)
		let archive
		// if (hasArchive && ARCHIVE_COLLECTIONS[key]) {
		// 	archive = readArchive()
		// 	if (archive === undefined) {
		// 		archive = getDefaultData(collection.type)
		// 	}
		// }
		const { changed, archived } = operator.cleanUp(data, channelId, {
			now,
			archive,
			isArchived,
			hasExpired,
			clearOnArchived: collection.clearOnArchived,
			clearOnExpire: collection.clearOnExpire
		})
		if (changed) {
			write(data)
			updatedCollections.push(key)
		}
		if (archived) {
			writeArchive(archive)
		}
	}
	addArchivedThreads()
	if (hasArchive) {
		removeExpiredThreads()
	}
	return {
		// updatedCollections,
		subscribedThreadsChanged: updatedCollections.includes(SUBSCRIBED_THREADS_INDEX_COLLECTION_NAME) ||
			updatedCollections.includes(SUBSCRIBED_THREADS_COLLECTION_NAME)
	}
}

function trackArchivedThreads(_isArchived, _read, _write, channelId, now) {
	const archivedThreadIds = []
	const isArchived = (threadId) => {
		if (_isArchived(threadId)) {
			if (!archivedThreadIds.includes(threadId)) {
				archivedThreadIds.push(threadId)
			}
			return true
		}
	}
	const addArchivedThreads = () => {
		if (archivedThreadIds.length === 0) {
			return
		}
		const key = ARCHIVE_PREFIX + ARCHIVED_THREADS_ACCESSED_AT_COLLECTION_NAME
		const archivedThreads = _read(key) || {}
		if (!archivedThreads[channelId]) {
			archivedThreads[channelId] = {}
		}
		for (const threadId of archivedThreadIds) {
			if (!archivedThreads[channelId][threadId]) {
				archivedThreads[channelId][threadId] = ARCHIVED_THREADS_ACCESSED_AT_COLLECTION.encode({
					archivedAt: new Date(now)
				})
			}
		}
		_write(key, archivedThreads)
	}
	return [isArchived, addArchivedThreads]
}

function trackExpiredThreads(_hasExpired, _read, _write, channelId, now, collections) {
	const expiredThreadIds = []
	const hasExpired = (threadId) => {
		if (_hasExpired(threadId)) {
			if (!expiredThreadIds.includes(threadId)) {
				expiredThreadIds.push(threadId)
			}
			return true
		}
	}
	const removeExpiredThreads = () => {
		if (expiredThreadIds.length === 0) {
			return
		}
		const readArchive = (key) => _read(ARCHIVE_PREFIX + key)
		const writeArchive = (key, value) => _write(ARCHIVE_PREFIX + key, value)
		onThreadsArchivedOrExpired(channelId, {
			isArchived: () => false,
			hasExpired: _hasExpired
		}, {
			now,
			hasArchive: false,
			collections: ARCHIVE_COLLECTIONS,
			read: readArchive,
			write: writeArchive
		})
	}
	return [hasExpired, removeExpiredThreads]
}

const CHANNELS_THREADS = {
	moveToArchive(archive, channelId, threadId) {
		if (!archive[channelId]) {
			archive[channelId] = []
		}
		if (!archive[channelId].includes(threadId)) {
			archive[channelId].push(threadId)
		}
	},
	cleanUp(data, channelId, {
		archive,
		isArchived,
		hasExpired
	}) {
		let changed
		let archived
		const threadIds = data[channelId]
		if (threadIds) {
			const archivedThreadIds = threadIds.filter(isArchived)
			const remainingThreadIds = threadIds.filter((threadId) => {
				return !archivedThreadIds.includes(threadId) && !hasExpired(threadId)
			})
			if (remainingThreadIds.length < threadIds.length) {
				if (remainingThreadIds.length === 0) {
					delete data[channelId]
				} else {
					data[channelId] = remainingThreadIds
				}
				changed = true
				// Move archived thread IDs to archive.
				if (archive) {
					if (archivedThreadIds.length > 0) {
						for (const threadId of archivedThreadIds) {
							this.moveToArchive(archive, channelId, threadId)
						}
						archived = true
					}
				}
			}
		}
		return { changed, archived }
	}
}

const CHANNELS_THREADS_DATA = {
	moveToArchive(archive, channelId, threadId, threadData) {
		if (!archive[channelId]) {
			archive[channelId] = {}
		}
		archive[channelId][threadId] = threadData
	},
	remove(data, channelId, threadId) {
		const threadData = data[channelId][threadId]
		delete data[channelId][threadId]
		if (Object.keys(data[channelId]).length === 0) {
			delete data[channelId]
		}
		return threadData
	},
	cleanUp(data, channelId, {
		archive,
		isArchived,
		hasExpired
	}) {
		let changed
		let archived
		if (data[channelId]) {
			for (const threadId of Object.keys(data[channelId])) {
				if (isArchived(parseInt(threadId))) {
					const threadData = this.remove(data, channelId, threadId)
					changed = true
					if (archive) {
						this.moveToArchive(archive, channelId, threadId, threadData)
						archived = true
					}
				} else if (hasExpired(parseInt(threadId))) {
					this.remove(data, channelId, threadId)
					changed = true
				}
			}
		}
		return { changed, archived }
	}
}

const THREADS_LIST = {
	cleanUp(data, channelId, {
		now,
		archive,
		clearOnArchived,
		clearOnExpire,
		isArchived,
		hasExpired
	}) {
		let changed
		let archived
		const removedThreads = []
		for (const thread of data) {
			if (thread.channel.id === channelId) {
				if (isArchived(thread.id)) {
					if (clearOnArchived) {
						removedThreads.push(thread)
						changed = true
					} else {
						if (!thread.archived) {
							thread.archived = true
							thread.archivedAt = encodeTimestamp(now)
							// "Archived" also means "Locked".
							if (!thread.locked) {
								thread.locked = true
								thread.lockedAt = encodeTimestamp(now)
							}
							changed = true
						}
					}
				} else if (hasExpired(thread.id)) {
					if (clearOnExpire === false) {
						if (!thread.expired) {
							thread.expired = true
							thread.expiredAt = encodeTimestamp(now)
							changed = true
						}
					} else {
						removedThreads.push(thread)
						changed = true
					}
				}
			}
		}
		if (removedThreads.length > 0) {
			data = data.filter(thread => !removedThreads.includes(thread))
		}
		return { changed, archived }
	}
}

function getOperator(collectionType) {
	switch (collectionType) {
		case 'channels-threads':
			return CHANNELS_THREADS
		case 'channels-threads-data':
		case 'channels-threads-comments':
		case 'channels-threads-comments-data':
			return CHANNELS_THREADS_DATA
		case 'threads-list':
			return THREADS_LIST
		default:
			throw new Error(`Unsupported collection type: ${collectionType}`)
	}
}

function isSupportedCollectionType(collectionType) {
	switch (collectionType) {
		case 'channels-threads':
		case 'channels-threads-data':
		case 'channels-threads-comments':
		case 'channels-threads-comments-data':
		case 'threads-list':
			return true
		case 'channels-data':
		case 'list':
		case 'value':
			return false
		default:
			throw new Error(`Unsupported collection type: ${collectionType}`)
	}
}

function getDefaultData(collectionType) {
	switch (collectionType) {
		case 'channels-threads':
		case 'channels-threads-data':
		case 'channels-threads-comments':
		case 'channels-threads-comments-data':
			return {}
		case 'threads-list':
			return []
		default:
			throw new Error(`Unsupported collection type: ${collectionType}`)
	}
}