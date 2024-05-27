import type { UserData as UserDataType, UserDataJsonEncoded, UserDataChunkData, UserDataCollections, UserDataCollectionDataEncoded, UserDataCollection, UserDataChunkMetadata, UserDataChunkDataEncoded } from '@/types'
import type { Storage } from 'web-browser-storage'
import type UserDataCleaner from './UserDataCleaner.js'

import { CachedStorage } from 'web-browser-storage/cache'

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

const debug = (...args: any[]) => console.log(['UserData'].concat(args))

export default class UserData implements Partial<UserDataType> {
	private collections: UserDataCollections
	private storage: Storage
	private prefix: string
	private log: (...args: any[]) => void
	private userDataCleaner?: boolean

	// `collections` parameter is only passed in tests.
	constructor(storage: Storage, {
		prefix = '',
		collections = COLLECTIONS as UserDataCollections,
		log = debug,
		userDataCleaner
	}: {
		prefix?: string,
		collections?: UserDataCollections,
		log?: (...args: any[]) => void,
		// `userDataCleaner` is not yet created at the time of creating a `UserData` instance.
		// That's why it's passed as a `boolean` rather than a `UserDataCleaner` instance.
		userDataCleaner?: boolean
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
		this.userDataCleaner = userDataCleaner

		// Add data access methods.
		createDataAccessMethods.call(this, {
			collections,
			storage,
			prefix,
			log,
			getCollectionDataValidationFunction(collection: UserDataCollection) {
				return getCollectionDataValidationFunction(collection)
			},
			getCollectionDataItemValidationFunction(collection: UserDataCollection) {
				return getCollectionDataValidationFunction(collection, { target: 'item' })
			}
		})

		// Add custom data access methods.
		createCustomDataAccessMethods.call(this, { collections })

		// Cache collections that're marked as such.
		this.forEachCollection((collection: UserDataCollection) => {
			if (collection.cache) {
				if (storage instanceof CachedStorage) {
					if (!collection.merge) {
						throw new Error(`User Data collection "${collection.name}" is marked as cached but doesn't define a \`merge()\` function`)
					}
					storage.cacheKey(prefix + getCollectionChunkKeyPattern(collection))
				}
			}
		})
	}

	getCollections() {
		return this.collections
	}

	start() {
		// Start a `CachedStorage`, if it is one.
		// A "started" `CachedStorage` would listen to external changes
		// to `localStorage` and then refresh its internal cache accordingly.
		if (this.storage instanceof CachedStorage) {
			this.storage.start()
		}
	}

	stop() {
		// Stop a `CachedStorage`, if it is one.
		// A "started" `CachedStorage` would listen to external changes
		// to `localStorage` and then refresh its internal cache accordingly.
		if (this.storage instanceof CachedStorage) {
			this.storage.stop()
		}
	}

	clear = () => {
		this._onDataAccess()

		for (const key of this.storage.keys()) {
			this.forEachCollection((collection: UserDataCollection) => {
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

	replace(data: UserDataJsonEncoded) {
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

	replaceCollectionData(collection: UserDataCollection, collectionData: UserDataCollectionDataEncoded) {
		// Erase previous data.
		const chunks = this.getCollectionDataChunks(collection)
		for (const chunk of chunks) {
			chunk.delete()
		}

		// Write new data.
		forEachCollectionChunkInData(
			collection,
			collectionData,
			(chunkData: UserDataChunkDataEncoded, metadata: UserDataChunkMetadata) => {
				const writeData = (key: string, data: UserDataChunkDataEncoded) => this.storage.set(this.prefix + key, data)
				writeData(
					getCollectionChunkKey(collection, metadata),
					chunkData
				)
			}
		)
	}

	merge(data: UserDataJsonEncoded) {
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
				(chunkData: any, { channelId, threadId }: UserDataChunkMetadata) => {
					const args = [];
					if (channelId) {
						args.push(channelId);
					}
					if (threadId) {
						args.push(threadId);
					}
					args.push(chunkData)

					// @ts-expect-error
					this[getMethodName('mergeWith', collection.name)].apply(this, args)
				}
			)
		}
	}

	requiresMigration() {
		// Added this assignment to fix TypeScript error.
		const userData = this as unknown as UserDataType
		const version = userData.getVersion() || 0
		return version < VERSION
	}

	migrate() {
		// Added this assignment to fix TypeScript error.
		const userData = this as unknown as UserDataType
		const version = userData.getVersion() || 0
		this._migrateFromVersion(version)
		userData.setVersion(VERSION)
	}

	_migrateFromVersion(version: number) {
		this.log(`Migrate from version ${version}`)
		migrateUserData({
			source: 'storage',
			version,
			collections: this.collections,
			forEachCollectionChunk: (
				collection: UserDataCollection,
				onCollectionChunk: (chunkDataEncoded: UserDataChunkDataEncoded, parameters: {
					update: (chunkDataEncoded: UserDataChunkDataEncoded) => void,
					metadata: UserDataChunkMetadata
				}) => void
			) => {
				const chunks = this.getCollectionDataChunks(collection)
				for (const chunk of chunks) {
					onCollectionChunk(chunk.read(), {
						update: (chunkDataEncoded: UserDataChunkDataEncoded) => this.storage.set(this.prefix + chunk.key, chunkDataEncoded),
						metadata: chunk.metadata
					})
				}
			},
			readData: (key: string): UserDataChunkDataEncoded | null => {
				return this.storage.get(this.prefix + key)
			},
			writeData: (key: string, chunkDataEncoded: UserDataChunkDataEncoded) => {
				this.storage.set(this.prefix + key, chunkDataEncoded)
			},
			removeData: (key: string) => {
				this.storage.delete(this.prefix + key)
			},
			writeCollectionChunkData: (collection: UserDataCollection, metadata: UserDataChunkMetadata, chunkDataEncoded: UserDataChunkDataEncoded) => {
				this.storage.set(this.prefix + getCollectionChunkKey(collection, metadata), chunkDataEncoded)
			}
		})
	}

	matchKey(key: string) {
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

	forEachCollection(func: (collection: UserDataCollection) => void) {
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
	 */
	getCollectionDataChunks(collection: UserDataCollection) {
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
	getCollectionData(collection: UserDataCollection) {
		return getCollectionData(collection, {
			storage: this.storage,
			prefix: this.prefix
		})
	}

	/**
	 * Adds an "on change" listener for external storage data updates.
	 * @param  {function} handler
	 */
	onExternalChange(handler: (parameters: {
		collection: UserDataCollection,
		metadata: UserDataChunkMetadata,
		value: UserDataChunkDataEncoded
	}) => void) {
		return this.storage.onExternalChange(({ key, value }: { key: string, value: any }) => {
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
		if (this.storage instanceof CachedStorage) {
			this.storage.flush()
		}
	}

	_onDataAccess() {
		// `UserDataCleaner` itself uses `UserData` to access User Data
		// while performing a clean-up, so make those `UserData` reads
		// bypass the "data access" detection which would otherwise
		// cancel the clean-up process.
		if (!this.userDataCleaner) {
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
	}

	// Merges collection data for a storage key.
	// Is used in "cached" storage when merging external changes.
	// See `CachedLocalStorage`.
	mergeKeyData = (key: string, prevValue: UserDataChunkData, newValue: UserDataChunkData) => {
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