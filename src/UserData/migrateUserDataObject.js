import migrateUserData from './UserData.migrate.js'
import { getCollectionDataObjectChunks } from './collection.utility.js'

export default function migrateUserDataObject(data, { collections, VERSION }) {
	const version = data.version || 0
	if (version < VERSION) {
		for (const collectionName of Object.keys(data)) {
			if (!collections[collectionName]) {
				throw new Error(`Unknown collection encountered when migrating user data: "${collectionName}"`);
			}
		}
		migrateUserData({
			source: 'object',
			version,
			collections,
			forEachCollectionChunk: (collection, onCollectionChunk) => {
				const chunks = getCollectionDataObjectChunks(collection, data)
				for (const chunk of chunks) {
					// `chunk.data` is encoded.
					onCollectionChunk(chunk.data, {
						update: (chunkData) => {
							const { channelId, threadId } = chunk.metadata
							if (channelId) {
								if (threadId) {
									data[collection.name][channelId][String(threadId)] = chunkData
								} else {
									data[collection.name][channelId] = chunkData
								}
							} else {
								data[collection.name] = chunkData
							}
						},
						metadata: chunk.metadata
					})
				}
			},
			readData: (key) => data[key],
			writeData: (key, data_) => data[key] = data_,
			removeData: (key) => delete data[key],
			writeCollectionChunkData: (collection, metadata, chunkData) => {
				const { channelId, threadId } = metadata
				if (channelId) {
					if (threadId) {
						if (!data[collection.name]) {
							data[collection.name] = {}
						}
						if (!data[collection.name][channelId]) {
							data[collection.name][channelId] = {}
						}
						data[collection.name][channelId][String(threadId)] = chunkData
					} else {
						if (!data[collection.name]) {
							data[collection.name] = {}
						}
						data[collection.name][channelId] = chunkData
					}
				} else {
					data[collection.name] = chunkData
				}
			}
		})
		data.version = VERSION
	}
}