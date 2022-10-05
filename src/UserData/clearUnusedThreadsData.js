import { threads } from './collections/index.js'
import getUserData from '../UserData.js'
import { isCollectionTypeSplitByChannelAndThread, isCollectionTypeSplitByChannel } from './collection.utility.js'

/**
 * This function could be called periodically
 * (for example, once a day) to clear some of the data of the threads
 * that have been archived for a very long time.
 * It could be run via something like `requestIdleCallback()`.
 *
 * When a thread expires, its data is not immediately deleted.
 * That's because a thread's page could return HTTP status 404 "Not Found"
 * due to some incorrect web server configuration, or a DDoS outage, etc.
 * In order to not lose user's data, such as own comment IDs,
 * that data is not deleted immediately after a thread becomes inaccessible.
 *
 * @return {function} A function that clears unused threads data.
 */
export default function clearUnusedThreadsData({
	userData = getUserData(),
	unusedThreadDataLifeTime,
	timer,
	log = () => {}
}) {
	const _log = log
	log = (...args) => _log.apply(this, ['Clear unused threads data'].concat(args))

	log('Analyze: Start')

	const operations = []

	const availableThreadsByChannel = userData.getCollectionData(threads) || {}

	const isThreadAvailable = (channelId, threadId) => {
		if (availableThreadsByChannel[channelId]) {
			return availableThreadsByChannel[channelId].includes(threadId)
		}
		return false
	}

	function isTimeToClearArchivedThreadData(channelId, threadId, unusedThreadDataLifeTime) {
		const accessedAt = userData.getThreadAccessedAt(channelId, threadId)
		if (accessedAt) {
			return timer.now() - accessedAt.getTime() > unusedThreadDataLifeTime
		}
		return true
	}

	userData.forEachCollection((collection) => {
		if (collection.clearOnExpire === false) {
			return
		}
		if (isCollectionTypeSplitByChannelAndThread(collection.type)) {
			const dataChunks = userData.getCollectionDataChunks(collection)
			for (const dataChunk of dataChunks) {
				const {
					metadata: {
						channelId,
						threadId
					}
				} = dataChunk
				if (!isThreadAvailable(channelId, threadId)) {
					if (isTimeToClearArchivedThreadData(channelId, threadId, unusedThreadDataLifeTime)) {
						log('Clear data for thread', threadId, 'in channel', channelId, 'for collection', collection.name)
						operations.push(() => dataChunk.delete())
					}
				}
			}
		} else if (isCollectionTypeSplitByChannel(collection.type)) {
			if (collection.type === 'channels-threads' || collection.type === 'channels-thread-data') {
				const dataChunks = userData.getCollectionDataChunks(collection)
				for (const dataChunk of dataChunks) {
					const {
						metadata: {
							channelId
						}
					} = dataChunk
					if (availableThreadsByChannel[channelId]) {
						function shouldKeepThreadData(threadId) {
							if (availableThreadsByChannel[channelId].includes(threadId)) {
								return true
							}
							if (isTimeToClearArchivedThreadData(channelId, threadId, unusedThreadDataLifeTime)) {
								log('Clear data for thread', threadId, 'in channel', channelId, 'for collection', collection.name)
								return false
							}
							// Keep the thread's data for now.
							return true
						}
						let newData = dataChunk.read()
						if (collection.type === 'channels-threads') {
							newData = newData.filter((threadId) => shouldKeepThreadData(threadId))
						} else if (collection.type === 'channels-thread-data') {
							for (const threadIdString of Object.keys(newData)) {
								const threadId = Number(threadIdString)
								if (!shouldKeepThreadData(threadId)) {
									delete newData[threadIdString]
								}
							}
						} else {
							throw new Error(`Unsupported collection type: ${collection.type}`)
						}
						operations.push(() => dataChunk.write(newData))
					}
				}
			}
		}
	})

	log('Analyze: End')

	return () => {
		for (const operation of operations) {
			operation()
		}
	}
}