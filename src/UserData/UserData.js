import * as COLLECTIONS from './collections/index.js'

import {
	getCollectionData,
	getCollectionDataChunks,
	forEachCollectionChunkInData,
	getCollectionChunkKey,
	getCollectionChunkKeyPattern,
	doesKeyBelongToCollection,
	getMetadataFromKey
} from './collection.utility.js'

import getMethodName from './getMethodName.js'
import migrateUserDataObject from './migrateUserDataObject.js'
import migrateUserData from './UserData.migrate.js'
import createDataAccessMethods from './UserData.createCollectionDataAccessMethods.js'
import createCustomDataAccessMethods from './UserData.createCollectionDataAccessMethods.custom.js'
import getCollectionDataValidationFunction from './UserData.getCollectionDataValidationFunction.js'
import validateCollections from './UserData.validateCollections.js'

import { getUserDataCleaner } from '../utility/globals.js'

// Current version of user data.
// See `UserData.migrate.js` comments for the changelog.
export const VERSION = 5

const debug = (...args) => console.log(['UserData'].concat(args))

export default class UserData {
	// `collections` parameter is only passed in tests.
	constructor(storage, {
		prefix = '',
		collections = COLLECTIONS,
		log = debug
	} = {}) {
		// `collections` will be "mutated".
		collections = { ...collections }

		// for (const collectionName of Object.keys(collections)) {
		// 	// Add `collection.name` property for each collection.
		// 	// Don't "mutate" the original collection object.
		// 	collections[collectionName] = {
		// 		name: collectionName,
		// 		...collections[collectionName]
		// 	}
		// }

		// Validate collections.
		validateCollections(collections)

		this.collections = collections
		this.storage = storage
		this.prefix = prefix
		this.log = log

		// Add data access methods.
		createDataAccessMethods.call(this, {
			collections,
			storage,
			prefix,
			log,
			getCollectionDataValidationFunction(collection) {
				return getCollectionDataValidationFunction(collection)
			},
			getCollectionDataItemValidationFunction(collection) {
				return getCollectionDataValidationFunction(collection, { target: 'item' })
			}
		})

		// Add custom data access methods.
		createCustomDataAccessMethods.call(this, { collections })

		// Cache collections that're marked as such.
		this.forEachCollection((collection) => {
			if (collection.cache && storage.cacheKey) {
				if (!collection.merge) {
					throw new Error(`User Data collection "${collection.name}" is marked as cached but doesn't define a \`merge()\` function`)
				}
				storage.cacheKey(prefix + getCollectionChunkKeyPattern(collection))
			}
		})
	}

	start() {
		// Start a `CachedLocalStorage`, if it is one.
		if (this.storage.start) {
			this.storage.start()
		}
	}

	stop() {
		// Stop a `CachedLocalStorage`, if it is one.
		if (this.storage.stop) {
			this.storage.stop()
		}
	}

	clear = () => {
		this._onDataAccess()

		for (const key of this.storage.keys()) {
			this.forEachCollection((collection) => {
				const unprefixedKey = key.slice(this.prefix.length)
				if (doesKeyBelongToCollection(unprefixedKey, collection)) {
					this.storage.delete(key)
				}
			})
		}
	}

	get() {
		this._onDataAccess()

		return Object.keys(this.collections).reduce((data, collectionName) => {
			const collection = this.collections[collectionName]
			const collectionData = this.getCollectionData(collection)
			if (collectionData === undefined) {
				return data
			}
			return {
				...data,
				[collectionName]: collectionData
			}
		}, {})
	}

	replace(data) {
		this._onDataAccess()

		// Migrate user data.
		migrateUserDataObject(data, {
			collections: this.collections,
			VERSION
		})

		// Clear current user data, including the archive.
		this.clear()

		// Get collection names and validate user data.
		const collectionNames = []
		for (const key of Object.keys(data)) {
			if (key !== 'version') {
				if (this.collections[key]) {
					collectionNames.push(key)
				} else {
					// A collection could have been removed from code
					// and the user might be attempting to merge in an old exported file.
					throw new Error(`Unknown collection encountered when replacing user data: "${key}"`)
				}
			}
		}

		// Set user data.
		for (const collectionName of collectionNames) {
			const collection = this.collections[collectionName]
			this.replaceCollectionData(
				collection,
				data[collectionName]
			)
		}
	}

	replaceCollectionData(collection, collectionData) {
		// Erase previous data.
		const chunks = this.getCollectionDataChunks(collection)
		for (const chunk of chunks) {
			chunk.delete()
		}

		// Write new data.
		forEachCollectionChunkInData(
			collection,
			collectionData,
			(chunkData, metadata) => {
				const writeData = (key, data) => this.storage.set(this.prefix + key, data)
				writeData(
					getCollectionChunkKey(collection, metadata),
					chunkData
				)
			}
		)
	}

	merge(data) {
		this._onDataAccess()

		// Migrate user data.
		migrateUserDataObject(data, {
			collections: this.collections,
			VERSION
		})

		// Get collection names and validate user data.
		const collectionNames = []
		for (const key of Object.keys(data)) {
			if (key !== 'version') {
				if (this.collections[key]) {
					collectionNames.push(key)
				} else {
					// A collection could have been removed from code
					// and the user might be attempting to merge in an old exported file.
					throw new Error(`Unknown collection encountered when merging user data: "${key}"`)
				}
			}
		}

		// Merge user data.
		for (const collectionName of collectionNames) {
			const collection = this.collections[collectionName]

			forEachCollectionChunkInData(
				collection,
				data[collection.name],
				(chunkData, { channelId, threadId }) => {
					const args = [];
					if (channelId) {
						args.push(channelId);
					}
					if (threadId) {
						args.push(threadId);
					}
					args.push(chunkData)

					this[getMethodName('mergeWith', collection.name)].apply(this, args)
				}
			)
		}
	}

	requiresMigration() {
		const version = this.getVersion() || 0
		return version < VERSION
	}

	migrate() {
		const version = this.getVersion() || 0
		this._migrateFromVersion(version)
		this.setVersion(VERSION)
	}

	_migrateFromVersion(version) {
		this.log(`Migrate from version ${version}`)
		migrateUserData({
			source: 'storage',
			version,
			collections: this.collections,
			forEachCollectionChunk: (collection, onCollectionChunk) => {
				const chunks = this.getCollectionDataChunks(collection)
				for (const chunk of chunks) {
					onCollectionChunk(chunk.read(), {
						update: (chunkData) => this.storage.set(this.prefix + chunk.key, chunkData),
						metadata: chunk.metadata
					})
				}
			},
			readData: (key) => this.storage.get(this.prefix + key),
			writeData: (key, data) => this.storage.set(this.prefix + key, data),
			removeData: (key) => this.storage.delete(this.prefix + key),
			writeCollectionChunkData: (collection, metadata, chunkData) => {
				this.storage.set(this.prefix + getCollectionChunkKey(collection, metadata), chunkData)
			}
		})
	}

	matchKey(key) {
		for (const collectionName of Object.keys(this.collections)) {
			const collection = this.collections[collectionName]
			if (doesKeyBelongToCollection(key, collection)) {
				return {
					collectionName,
					metadata: getMetadataFromKey(key, collection)
				}
			}
		}
	}

	getSize() {
		let size = 0
		for (const key of this.storage.keys()) {
			if (this.matchKey(key)) {
				size += this.storage.getRecordSize(key)
			}
		}
		return size
	}

	forEachCollection(func) {
		for (const collectionName of Object.keys(this.collections)) {
			func(this.collections[collectionName])
		}
	}

	// mapCollections(mapper) {
	// 	return Object.keys(this.collections).map((collectionName) => {
	// 		return mapper(this.collections[collectionName])
	// 	})
	// }

	/**
	 * Returns non-decoded collection data chunks.
	 * @param {object} collection
	 * @return {object[]} Objects of shape: `{ data: any, metadata: object }`.
	 */
	getCollectionDataChunks(collection) {
		return getCollectionDataChunks(collection, {
			storage: this.storage,
			prefix: this.prefix
		})
	}

	/**
	 * Returns non-decoded collection data.
	 * @param {object} collection
	 * @return {any} Collection data (encoded). Returns `undefined` if the collection doesn't exist yet.
	 */
	getCollectionData(collection) {
		return getCollectionData(collection, {
			storage: this.storage,
			prefix: this.prefix
		})
	}

	/**
	 * Adds an "on change" listener for external storage data updates.
	 * @param  {function} handler
	 */
	onExternalChange(handler) {
		return this.storage.onExternalChange(({ key, value }) => {
			if (!key) {
				return
			}
			const unprefixedKey = key.slice(this.prefix.length)
			if (!key.startsWith(this.prefix)) {
				return
			}
			const match = this.matchKey(unprefixedKey)
			if (match) {
				const { collectionName, metadata } = match
				this._onDataAccess()
				return handler({
					collection: this.collections[collectionName],
					metadata,
					value
				})
			}
		})
	}

	// Flushes any cached writes.
	// For example, `CachedLocalStorage` caches writes for some `UserData` collections.
	flush() {
		if (this.storage.flush) {
			this.storage.flush()
		}
	}

	_onDataAccess() {
		if (getUserDataCleaner()) {
			// If `UserData` is being accessed, postpone a clean-up.
			// The reason is that if a clean-up was in progress during a sequence of
			// `UserData` reads performed by some code, that code could end up with
			// an inconsistent overall picture because somewhere in-between some of the
			// old records got removed.
			//
			// For example, consider a code that first reads "own threads" collection,
			// and then, for each "own thread", it reads "own comments" collection.
			// "Own comments" collection data includes the "own" flag for the "root" comment
			// of a thread, so if an "own thread" record exists for a thread, then it means
			// that at least one "own comment" record also exists.
			// But if that thread's data got cleaned up somewhere in-between those two reads,
			// by the time the code starts reading "own comments" collection data, it might
			// already be removed for that thread by User Data Cleaner, and the code might
			// throw an error in that case.
			//
			getUserDataCleaner().cancel()
		}
	}

	// Merges collection data for a storage key.
	// Is used in "cached" storage when merging external changes.
	// See `CachedLocalStorage`.
	mergeKeyData = (key, prevValue, newValue) => {
		const unprefixedKey = key.slice(this.prefix.length)
		for (const collectionName of Object.keys(this.collections)) {
			const collection = this.collections[collectionName]
			if (doesKeyBelongToCollection(unprefixedKey, collection)) {
				if (collection.merge) {
					return collection.merge(prevValue, newValue)
				}
			}
		}
		return newValue
	}
}