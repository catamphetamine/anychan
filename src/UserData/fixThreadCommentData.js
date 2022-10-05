import getUserData from '../UserData.js'

import {
	hiddenThreads,
	hiddenComments,
	ownThreads,
	ownComments,
	threadVotes,
	commentVotes
} from './collections/index.js'

export default function fixThreadCommentData({ userData = getUserData(), log = () => {} }) {
	const _log = log
	log = (...args) => _log.apply(this, ['Fix thread/comment data'].concat(args))

	log('Analyze: Start')

	const operations = []

	// Fix `hiddenThreads`/`hiddenComments` collection.
	fixThreadsData({
		threadsCollection: hiddenThreads,
		commentsCollection: hiddenComments,
		createThreadRecord(channelId, threadId) {
			operations.push(() => userData.addHiddenThread(channelId, threadId))
		},
		createCommentRecord(channelId, threadId, commentId) {
			operations.push(() => userData.addHiddenComment(channelId, threadId, commentId))
		},
		collectionType: CHANNEL_THREAD_COMMENT_IDS_COLLECTION_TYPE,
		userData
	})

	// Fix `ownThreads`/`ownComments` collection.
	fixThreadsData({
		threadsCollection: ownThreads,
		commentsCollection: ownComments,
		createThreadRecord(channelId, threadId) {
			operations.push(() => userData.addOwnThread(channelId, threadId))
		},
		createCommentRecord(channelId, threadId, commentId) {
			operations.push(() => userData.addOwnComment(channelId, threadId, commentId))
		},
		collectionType: CHANNEL_THREAD_COMMENT_IDS_COLLECTION_TYPE,
		userData
	})

	// Fix `threadVotes`/`commentVotes` collection.
	fixThreadsData({
		threadsCollection: threadVotes,
		commentsCollection: commentVotes,
		createThreadRecord(channelId, threadId, vote) {
			operations.push(() => userData.setThreadVote(channelId, threadId, vote))
		},
		createCommentRecord(channelId, threadId, commentId, vote) {
			operations.push(() => userData.setCommentVote(channelId, threadId, commentId, vote))
		},
		collectionType: CHANNEL_THREAD_COMMENT_DATA_COLLECTION_TYPE,
		userData
	})

	log('Analyze: End')

	return () => {
		for (const operation of operations) {
			operation()
		}
	}
}

function fixThreadsData({
	threadsCollection,
	commentsCollection,
	createThreadRecord,
	createCommentRecord,
	collectionType,
	userData
}) {
	const {
		getCommentData,
		isIncludedInThreadsData,
		isIncludedInCommentsData,
		getThreadIds,
		getThreadData,
		addThreadData,
		createEmptyThreadsData
	} = collectionType

	const threadsData = userData.getCollectionData(threadsCollection) || {}
	const commentsDataChunks = userData.getCollectionDataChunks(commentsCollection)

	const threadsIncludedInCommentsData = {}

	// Fix missing threads collection records.
	for (const chunk of commentsDataChunks) {
		const { metadata: { channelId, threadId }, read } = chunk
		const chunkData = read()

		// If the thread's root comment isn't included, then skip.
		if (!isIncludedInCommentsData(chunkData, threadId)) {
			continue
		}

		// Create "included" map record.
		if (!threadsIncludedInCommentsData[channelId]) {
			threadsIncludedInCommentsData[channelId] = []
		}
		threadsIncludedInCommentsData[channelId].push(threadId)

		// The thread's root comment is included.
		// Check that there's a corresponding threads collection record.
		if (threadsData[channelId] && isIncludedInThreadsData(threadsData[channelId], threadId)) {
			continue
		}

		if (!threadsData[channelId]) {
			threadsData[channelId] = createEmptyThreadsData()
		}

		const threadData = getCommentData(chunkData, threadId)

		addThreadData(threadsData[channelId], threadId, threadData)
		createThreadRecord(channelId, threadId, threadData)
	}

	// Fix missing comments collection records.
	for (const channelId of Object.keys(threadsData)) {
		const threadIds = getThreadIds(threadsData[channelId] || createEmptyThreadsData())
		const threadIdsIncludedInCommentsData = threadsIncludedInCommentsData[channelId] || []
		for (const threadId of threadIds) {
			if (!threadIdsIncludedInCommentsData.includes(threadId)) {
				createCommentRecord(
					channelId,
					threadId,
					threadId,
					getThreadData(threadsData[channelId], threadId)
				)
			}
		}
	}
}

const CHANNEL_THREAD_COMMENT_IDS_COLLECTION_TYPE = {
	isIncludedInCommentsData(commentsData, commentId) {
		return commentsData.includes(commentId)
	},
	getCommentData(commentsData, commentId) {
		return undefined
	},
	isIncludedInThreadsData(threadsData, threadId) {
		return threadsData.includes(threadId)
	},
	createEmptyThreadsData() {
		return []
	},
	getThreadIds(threadsData) {
		return threadsData
	},
	getThreadData(threadsData, threadId) {
		return undefined
	},
	addThreadData(threadsData, threadId, threadData) {
		threadsData.push(threadId)
		threadsData.sort()
	}
}

const CHANNEL_THREAD_COMMENT_DATA_COLLECTION_TYPE = {
	isIncludedInCommentsData(commentsData, commentId) {
		return commentsData.hasOwnProperty(String(commentId))
	},
	getCommentData(commentsData, commentId) {
		return commentsData[String(commentId)]
	},
	isIncludedInThreadsData(threadsData, threadId) {
		return threadsData.hasOwnProperty(String(threadId))
	},
	createEmptyThreadsData() {
		return {}
	},
	getThreadIds(threadsData) {
		return Object.keys(threadsData)
	},
	getThreadData(threadsData, threadId) {
		return threadsData[String(threadId)]
	},
	addThreadData(threadsData, threadId, threadData) {
		threadsData[String(threadId)] = threadData
	}
}