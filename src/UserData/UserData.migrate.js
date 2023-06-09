import {
	isCollectionTypeSplitByChannelAndThread,
	isCollectionTypeSplitByChannel
} from './collection.utility.js'

import { decodeDate } from './compression.js'
import { subscribedThreadsState } from './collections/index.js'

const SOURCES = ['storage', 'object']

// The `version` of the current "User Data" is stored as `version` property in `localStorage`.
// The latest version of "User Data" structure is stored as `VERSION` in `UserData.js`.
export default function migrate({
	version,
	collections,
	forEachCollectionChunk,
	readData,
	writeData,
	removeData,
	writeCollectionChunkData,
	source
}) {
	if (!SOURCES.includes(source)) {
		throw new Error('One should specify a `source` parameter — either "storage" or "object" — when calling UserData/migrate function')
	}

	// Legacy.
	// Version 2.
	// Dec 22, 2020.
	// Renamed `favoriteBoards` -> `favoriteChannels`.
	if (version < 2) {
		const favoriteBoards = readData('favoriteBoards')
		if (favoriteBoards) {
			// This is before collections are migrated to using "short names" and "chunked" structure.
			writeData('favoriteChannels', favoriteBoards)
			removeData('favoriteBoards')
		}
	}

	// Version 5.
	// Renamed:
	// * "trackedThreads" -> "subscribedThreadsIndex"
	// * "trackedThreadsList" -> "subscribedThreads"
	if (version < 5) {
		const trackedThreads = readData('trackedThreads')
		if (trackedThreads) {
			// This is before collections are migrated to using "short names" and "chunked" structure.
			writeData('subscribedThreadsIndex', trackedThreads)
			removeData('trackedThreads')
		}
		const trackedThreadsList = readData('trackedThreadsList')
		if (trackedThreadsList) {
			// This is before collections are migrated to using "short names" and "chunked" structure.
			writeData('subscribedThreads', trackedThreadsList)
			removeData('trackedThreadsList')

			// Create `subscribedThreadsStats` collection.
			// Can use "short names" and "chunked" structure here.
			for (const subscribedThread of trackedThreadsList) {
				// `subscribedThread.channel` property was called `subscribedThread.board`
				// in version `1` of User Data.
				const channelId = (subscribedThread.board || subscribedThread.channel).id
				const threadId = subscribedThread.id
				writeCollectionChunkData(
					subscribedThreadsState,
					{ channelId, threadId },
					// Doesn't use:
					// `createSubscribedThreadStateRecordStubEncoded(decodeData(subscribedThread, collections['subscribedThreads']))`
					// because:
					// * `subscribedThreads` collection hasn't been migrated yet by this time.
					// * If the structure of the `subscribedThreadState` collection changes in some future,
					//   it will get reflected in further migrations anyway.
					{
						// The comments count of `1` is, obviously, not true, but it doesn't really matter,
						// because `commentsCount` is currently only used to check if "incremental" thread update
						// could be used.
						commentsCount: 1,
						newCommentsCount: 0,
						newRepliesCount: 0,
						// Encoded.
						latestComment: {
							// This is the ID of the first comment rather than the ID of the latest comment,
							// but it still works. The ID of the latest comment isn't currently used anyway.
							id: subscribedThread.id,
							createdAt: subscribedThread.addedAt
						},
						// Encoded.
						refreshedAt: subscribedThread.addedAt
					}
				)
			}
		}
	}

	// Version 5.
	// Split `commentVotes` collection into `threadVotes` and `commentVotes`.
	// Now the `commentVotes` collection doesn't include the vote
	// for the "original comment" of the thread:
	// that one is stored in `threadVotes` collection.
	// The rationale is that it's easier to get the votes
	// for all threads in a channel using `threadVotes` collection
	// rather than iterating over all matching `commentVotes` collection records.
	if (version < 5) {
		let threadVotes
		const commentVotes = readData('commentVotes')
		if (commentVotes) {
			for (const channelId of Object.keys(commentVotes)) {
				for (const threadId of Object.keys(commentVotes[channelId])) {
					// Split `commentVotes` collection into `threadVotes` and `commentVotes`.
					const threadCommentVotes = commentVotes[channelId][threadId]
					if (threadCommentVotes[threadId]) {
						if (!threadVotes) {
							threadVotes = {}
						}
						if (!threadVotes[channelId]) {
							threadVotes[channelId] = {}
						}
						threadVotes[channelId][threadId] = threadCommentVotes[threadId]
						delete threadCommentVotes[threadId]
					}
				}
			}
			// This is before collections are migrated to using "short names" and "chunked" structure.
			writeData('commentVotes', commentVotes)
			if (threadVotes) {
				// This is before collections are migrated to using "short names" and "chunked" structure.
				writeData('threadVotes', threadVotes)
			}
		}
	}

	// Migrate each collection's data.
	for (const collectionName of Object.keys(collections)) {
		const collection = collections[collectionName]

		// Legacy.
		// Version <= 5.
		// `readData` and `writeData` are deprecated:
		// they were only used for version <= 5.
		if (version < 5) {
			const collectionData = readData(collection.name)
			if (collectionData !== undefined && collectionData !== null) {
				migrateCollectionDataLegacy({
					collection,
					version,
					readData,
					writeData,
					removeData,
					writeCollectionChunkData,
					source
				})
			}
		}

		// Version > 5.
		if (COLLECTION_CHUNK_MIGRATIONS[collection.name]) {
			let migrationVersions = Object.keys(COLLECTION_CHUNK_MIGRATIONS[collection.name])
			migrationVersions = migrationVersions.map(Number).sort((a, b) => a - b)
			for (const migrationVersion of migrationVersions) {
				if (version < migrationVersion) {
					const migrateChunkData = COLLECTION_CHUNK_MIGRATIONS[collection.name][migrationVersion]
					forEachCollectionChunk(
						collection,
						(chunkData, { update, metadata }) => {
							migrateChunkData(chunkData, { metadata })
							// These keys are shortened ones.
							// This is the only place in this migration code
							// where keys are shortened ones rather than longer ones.
							update(chunkData)
						}
					)
				}
			}
		}
	}
}

// Migrations for version > 5.
const COLLECTION_CHUNK_MIGRATIONS = {
	// [collection.name]: {
	// 	[version]: (chunk) => {
	// 		chunk.a = 'b'
	// 	}
	// }
}

// Migrations for version <= 5.
const COLLECTION_DATA_MIGRATIONS_LEGACY = {
	subscribedThreads: {
		// Version 1.
		// Dec 24, 2019.
		// Added `trackedThreadsList.expiredAt`.
		'1': (data) => {
			for (const thread of data) {
				if (thread.expired && !thread.expiredAt) {
					thread.expiredAt = Date.now()
				}
			}
		},
		// Version 2.
		// Dec 22, 2020.
		// Renamed `board` -> `channel`.
		'2': (data) => {
			for (const thread of data) {
				thread.channel = thread.board
				delete thread.board
			}
		},
		// Version 4.
		// July, 2021.
		'4': (data) => {
			for (const thread of data) {
				if (thread.expiredAt) {
					thread.expiredAt = Math.floor(thread.expiredAt / 1000)
				}
				if (thread.refreshedAt) {
					thread.refreshedAt = Math.floor(thread.refreshedAt / 1000)
				}
				thread.addedAt = Math.floor(thread.addedAt / 1000)
				// Before 23.01.2021 `thread.latestComment.createdAt` wasn't being encoded as `t`.
				if (thread.latestComment.createdAt) {
					thread.latestComment.t = Math.floor(thread.latestComment.createdAt / 1000)
					delete thread.latestComment.createdAt
				}
				// Rename `i` -> `number`.
				if (thread.latestComment.i !== undefined) {
					thread.latestComment.number = thread.latestComment.i + 1
					delete thread.latestComment.i
				}
			}
		},
		// Version 5.
		// Removed `latestComment`, `commentsCount` and `refreshedAt` properties.
		// Renamed `rolling` to `trimming`.
		'5': (data) => {
			for (const thread of data) {
				delete thread.latestComment
				delete thread.commentsCount
				delete thread.refreshedAt
				// `rolling` → `trimming`
				thread.trimming = thread.rolling
				delete thread.rolling
			}
		}
	},
	latestReadComments: {
		// Version 1.
		// Dec 24, 2019.
		// Converted `latestReadComments` from comment id to an object of shape:
		// `{ id, i, updatedAt?, threadUpdatedAt?, commentsCount }`.
		'1': (data) => {
			for (const channelId of Object.keys(data)) {
				for (const threadId of Object.keys(data[channelId])) {
					const id = data[channelId][threadId]
					data[channelId][threadId] = {
						id,
						i: 0
					}
				}
			}
		},
		// Version 3.
		// Jan 07, 2021.
		// Clean up unused `t` and `threadUpdatedAt` timestamps,
		// that also have been corrupted in some cases (`null`, `NaN`).
		// So, `latestReadComments` shape is now `{ id, i }`.
		'3': (data) => {
			for (const channelId of Object.keys(data)) {
				for (const threadId of Object.keys(data[channelId])) {
					delete data[channelId][threadId].t
					delete data[channelId][threadId].threadUpdatedAt
				}
			}
		},
		// Version 4.
		// July, 2021.
		// Rename `i` -> `number`.
		'4': (data) => {
			for (const channelId of Object.keys(data)) {
				for (const threadId of Object.keys(data[channelId])) {
					if (data[channelId][threadId].i !== undefined) {
						data[channelId][threadId].number = data[channelId][threadId].i + 1
						delete data[channelId][threadId].i
					}
				}
			}
		},
		// Version 5.
		// Changed record data from `{ id, number }` to just `id`.
		'5': (data) => {
			for (const channelId of Object.keys(data)) {
				for (const threadId of Object.keys(data[channelId])) {
					data[channelId][threadId] = data[channelId][threadId].id
					// if (data[channelId][threadId].number !== undefined) {
					// 	data[channelId][threadId].n = data[channelId][threadId].number
					// 	delete data[channelId][threadId].number
					// }
				}
			}
		}
	}
}

// Legacy.
// Migrates collections data for version <= 5.
// Mutates the `data` argument.
function migrateCollectionDataLegacy({
	collection,
	version,
	readData,
	writeData,
	removeData,
	writeCollectionChunkData,
	source
}) {
	// Migrate collections data.
	if (COLLECTION_DATA_MIGRATIONS_LEGACY[collection.name]) {
		let migrationVersions = Object.keys(COLLECTION_DATA_MIGRATIONS_LEGACY[collection.name])
		migrationVersions = migrationVersions.map(Number).sort((a, b) => a - b)
		for (const migrationVersion of migrationVersions) {
			if (version < migrationVersion) {
				const migrateData = COLLECTION_DATA_MIGRATIONS_LEGACY[collection.name][migrationVersion]
				const data = readData(collection.name)
				migrateData(data)
				// This is before collections are migrated to using "short names" and "chunked" structure.
				writeData(collection.name, data)
			}
		}
	}

	// Version 5.
	// August, 2021.
	// Changed storage structure: some collections are now split in chunks,
	// each chunk corresponding to a channel ID or a combination of
	// a channel ID and a thread ID.
	if (version < 5 && source === 'storage') {
		if (isCollectionTypeSplitByChannelAndThread(collection.type)) {
			const data = readData(collection.name)
			// Remove non-chunked data under non-short-name key.
			removeData(collection.name)
			// Add chunked data under short-name key.
			for (const channelId of Object.keys(data)) {
				for (const threadId of Object.keys(data[channelId])) {
					writeCollectionChunkData(
						collection,
						{ channelId, threadId },
						data[channelId][threadId]
					)
				}
			}
		} else if (isCollectionTypeSplitByChannel(collection.type)) {
			const data = readData(collection.name)
			// Remove non-chunked data under non-short-name key.
			removeData(collection.name)
			// Add chunked data under short-name key.
			for (const channelId of Object.keys(data)) {
				writeCollectionChunkData(
					collection,
					{ channelId },
					data[channelId]
				)
			}
		} else {
			const data = readData(collection.name)
			// Remove collection data stored under non-short-name key.
			removeData(collection.name)
			// Add collection data to be stored under short-name key.
			writeCollectionChunkData(
				collection,
				{},
				data
			)
		}
	}
}