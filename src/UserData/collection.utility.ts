import type { Storage } from 'web-browser-storage'
import type { UserDataCollection, UserDataChunkMetadata, UserDataChunkDataEncoded, UserDataChunkData, UserDataCollectionData } from '@/types'

// import { encodeData, decodeData } from './encodeDecode.js'
import matchesPattern from '../utility/matchesPattern.js'

export function getListItemCompareFunction(type: UserDataCollection['type']) {
	switch (type) {
		case 'channels-threads':
		case 'channels-threads-comments':
			return compareNumericIds
	}
}

export function getListItemMatchFunction(type: UserDataCollection['type']) {
	switch (type) {
		case 'channels-threads':
		case 'channels-threads-comments':
			return areEqualNumericIds
	}
}

function compareNumericIds(a: number, b: number) {
	return a > b ? 1 : (a < b ? -1 : 0)
}

function areEqualNumericIds(a: number, b: number) {
	return a === b
}

export function getUnderlyingCollectionType(type: UserDataCollection['type']) {
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

export function isCollectionTypeSplitByChannelAndThread(type: UserDataCollection['type']) {
	switch (type) {
		case 'channels-threads-comments-data':
		case 'channels-threads-comments':
		case 'channels-threads-data':
			return true
	}
}

export function isCollectionTypeSplitByChannel(type: UserDataCollection['type']) {
	switch (type) {
		case 'channels-threads':
		case 'channels-data':
		case 'channels-thread-data':
			return true
	}
}

export function getCollectionChunkKey(collection: UserDataCollection, { channelId, threadId }: UserDataChunkMetadata) {
	if (!collection.name) {
		throw new Error(`Collection doesn't have a \`name\` property:\n${JSON.stringify(collection, null, 2)}`)
	}
	return (collection.shortName || collection.name) +
		(channelId ? '/' + channelId : '') +
		(threadId ? '/' + threadId : '')
}

export function getCollectionChunkKeyPattern(collection: UserDataCollection) {
	if (isCollectionTypeSplitByChannel(collection.type)) {
		return (collection.shortName || collection.name) + '/' + '*'
	}
	if (isCollectionTypeSplitByChannelAndThread(collection.type)) {
		return (collection.shortName || collection.name) + '/' + '*' + '/' + '*'
	}
	return (collection.shortName || collection.name)
}

export function doesKeyBelongToCollection(key: string, collection: UserDataCollection) {
	return matchesPattern(key, getCollectionChunkKeyPattern(collection), {
		asteriskExcludeCharacter: '/',
		asteriskOneOrMoreCharacters: true
	})
}

export function getMetadataFromKey(key: string, collection: UserDataCollection) {
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
export function getCollectionDataChunks(
	collection: UserDataCollection,
	{ storage, prefix }: { storage: Storage, prefix: string }
) {
	const chunks: {
		key: string,
		metadata: UserDataChunkMetadata,
		read: () => UserDataChunkDataEncoded,
		write: (data: UserDataChunkDataEncoded) => void,
		delete: () => void
	}[] = []

	for (const key of storage.keys()) {
		const unprefixedKey = key.slice(prefix.length)
		if (doesKeyBelongToCollection(unprefixedKey, collection)) {
			chunks.push({
				key: unprefixedKey,
				metadata: getMetadataFromKey(unprefixedKey, collection),
				read: () => storage.get(key),
				// decode: (data) => decodeData(data, collection),
				// encode: (data) => encodeData(data, collection),
				write: (data: UserDataChunkDataEncoded) => storage.set(key, data),
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
export function getCollectionDataObjectChunks(collection: UserDataCollection, data: UserDataCollectionData) {
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
export function getCollectionData(collection: UserDataCollection, { storage, prefix }: { storage: Storage, prefix: string }) {
	const chunks = getCollectionDataChunks(collection, { storage, prefix })

	// If there's no collection data, return `undefined`.
	if (chunks.length === 0) {
		return
	}

	// Convert chunked data structure to a tree.
	if (isCollectionTypeSplitByChannelAndThread(collection.type)) {
		const data: Record<string, Record<string, UserDataChunkData>> = {}
		for (const chunk of chunks) {
			const { channelId, threadId } = getMetadataFromKey(chunk.key, collection)
			if (!data[channelId]) {
				data[channelId] = {}
			}
			data[channelId][threadId] = chunk.read()
		}
		return data
	} else if (isCollectionTypeSplitByChannel(collection.type)) {
		const data: Record<string, UserDataChunkData> = {}
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

export function forEachCollectionChunkInData(
	collection: UserDataCollection,
	data: UserDataChunkDataEncoded,
	func: (data: UserDataChunkDataEncoded, metadata: UserDataChunkMetadata) => void
) {
	if (isCollectionTypeSplitByChannelAndThread(collection.type)) {
		for (const channelId of Object.keys(data)) {
			for (const threadId of Object.keys(data[channelId])) {
				func(data[channelId][threadId], { channelId, threadId: Number(threadId) })
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