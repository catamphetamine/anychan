// import { encodeData, decodeData } from './encodeDecode.js'
import matchesPattern from '../utility/matchesPattern.js'

export function getListItemCompareFunction(type) {
	switch (type) {
		case 'channels-threads':
		case 'channels-threads-comments':
			return compareNumericIds
	}
}

export function getListItemIsEqualFunction(type) {
	switch (type) {
		case 'channels-threads':
		case 'channels-threads-comments':
			return isEqualByReference
	}
}

function compareNumericIds(a, b) {
	return a > b ? 1 : (a < b ? -1 : 0)
}

function isEqualByReference(a, b) {
	return a === b
}

export function getUnderlyingCollectionType(type) {
	switch (type) {
		case 'channels-threads':
		case 'channels-threads-comments':
			return 'list'
		case 'channels-data':
		case 'channels-threads-data':
			return 'value'
		case 'channels-thread-data':
			return 'map'
		case 'channels-threads-comments-data':
			return 'map'
		case 'map':
			return 'map'
		case 'list':
			return 'list'
		case 'value':
			return 'value'
		default:
			throw new Error(`Unknown collection type: ${type}`)
	}
}

export function isCollectionTypeSplitByChannelAndThread(type) {
	switch (type) {
		case 'channels-threads-comments-data':
		case 'channels-threads-comments':
		case 'channels-threads-data':
			return true
	}
}

export function isCollectionTypeSplitByChannel(type) {
	switch (type) {
		case 'channels-threads':
		case 'channels-data':
		case 'channels-thread-data':
			return true
	}
}

export function getCollectionChunkKey(collection, { channelId, threadId }) {
	if (!collection.name) {
		throw new Error(`Collection doesn't have a \`name\` property:\n${JSON.stringify(collection, null, 2)}`)
	}
	return (collection.shortName || collection.name) +
		(channelId ? '/' + channelId : '') +
		(threadId ? '/' + threadId : '')
}

export function getCollectionChunkKeyPattern(collection) {
	if (isCollectionTypeSplitByChannel(collection.type)) {
		return (collection.shortName || collection.name) + '/' + '*'
	}
	if (isCollectionTypeSplitByChannelAndThread(collection.type)) {
		return (collection.shortName || collection.name) + '/' + '*' + '/' + '*'
	}
	return (collection.shortName || collection.name)
}

export function doesKeyBelongToCollection(key, collection) {
	return matchesPattern(key, getCollectionChunkKeyPattern(collection), {
		asteriskExcludeCharacter: '/',
		asteriskOneOrMoreCharacters: true
	})
}

export function getMetadataFromKey(key, collection) {
	if (isCollectionTypeSplitByChannelAndThread(collection.type)) {
		const [collectionShortName, channelId, threadId] = key.split('/')
		return { channelId, threadId: Number(threadId) }
	}
	if (isCollectionTypeSplitByChannel(collection.type)) {
		const [collectionShortName, channelId] = key.split('/')
		return { channelId }
	}
	return {}
}

/**
 * Returns non-decoded collection data chunks.
 * @return {object[]} Objects of shape: `{ key: string, metadata: object, read(), write(data), delete() }`.
 */
export function getCollectionDataChunks(collection, { storage, prefix }) {
	const chunks = []
	for (const key of storage.keys()) {
		const unprefixedKey = key.slice(prefix.length)
		if (doesKeyBelongToCollection(unprefixedKey, collection)) {
			chunks.push({
				key: unprefixedKey,
				metadata: getMetadataFromKey(unprefixedKey, collection),
				read: () => storage.get(key),
				// decode: (data) => decodeData(data, collection),
				// encode: (data) => encodeData(data, collection),
				write: (data) => storage.set(key, data),
				delete: () => storage.delete(key)
			})
		}
	}
	return chunks
}

/**
 * Returns non-decoded collection data chunks.
 * @return {object[]} Objects of shape: `{ data: any, metadata: object }`.
 */
export function getCollectionDataObjectChunks(collection, data) {
	const chunks = []
	if (isCollectionTypeSplitByChannelAndThread(collection.type)) {
		for (const channelId of Object.keys(data)) {
			for (const threadId of Object.keys(data[channelId])) {
				chunks.push({
					data: data[channelId][threadId],
					metadata: {
						channelId,
						threadId: Number(threadId)
					}
				})
			}
		}
	} else if (isCollectionTypeSplitByChannel(collection.type)) {
		for (const channelId of Object.keys(data)) {
			chunks.push({
				data: data[channelId],
				metadata: {
					channelId
				}
			})
		}
	} else {
		chunks.push({
			data,
			metadata: {}
		})
	}
	return chunks
}

/**
 * Returns non-decoded collection data.
 * If collection data is split by chunks, it combines all thos chunks.
 * @param  {object} collection
 * @param  {object} options.storage
 * @param  {string} options.prefix
 * @return {any} Collection data (encoded).
 */
export function getCollectionData(collection, { storage, prefix }) {
	const chunks = getCollectionDataChunks(collection, { storage, prefix })

	// If there's no collection data, return `undefined`.
	if (chunks.length === 0) {
		return
	}

	// Convert chunked data structure to a tree.
	if (isCollectionTypeSplitByChannelAndThread(collection.type)) {
		const data = {}
		for (const chunk of chunks) {
			const { channelId, threadId } = getMetadataFromKey(chunk.key, collection)
			if (!data[channelId]) {
				data[channelId] = {}
			}
			data[channelId][threadId] = chunk.read()
		}
		return data
	} else if (isCollectionTypeSplitByChannel(collection.type)) {
		const data = {}
		for (const chunk of chunks) {
			const { channelId } = getMetadataFromKey(chunk.key, collection)
			if (!data[channelId]) {
				data[channelId] = {}
			}
			data[channelId] = chunk.read()
		}
		return data
	} else {
		const [chunk] = chunks
		return chunk.read()
	}
}

export function forEachCollectionChunkInData(collection, data, func) {
	if (isCollectionTypeSplitByChannelAndThread(collection.type)) {
		for (const channelId of Object.keys(data)) {
			for (const threadId of Object.keys(data[channelId])) {
				func(data[channelId][threadId], { channelId, threadId })
			}
		}
	} else if (isCollectionTypeSplitByChannel(collection.type)) {
		for (const channelId of Object.keys(data)) {
			func(data[channelId], { channelId })
		}
	} else {
		func(data, {})
	}
}