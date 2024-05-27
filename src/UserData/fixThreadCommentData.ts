import type { UserData, Channel, Thread, Comment, UserDataCollection, UserDataCollectionType } from '@/types'

import {
	hiddenThreads,
	hiddenComments,
	ownThreads,
	ownComments,
	threadVotes,
	commentVotes
} from './collections/index.js'

export default function fixThreadCommentData({
	userData,
	log = () => {}
}: {
	userData: UserData,
	log?: (...args: any[]) => void
}) {
	const _log = log
	log = (...args) => _log.apply(this, ['Fix thread/comment data'].concat(args))

	log('Analyze: Start')

	const operations: Array<() => void> = []

	// Fix `hiddenThreads`/`hiddenComments` collection.
	fixThreadsData({
		threadsCollection: hiddenThreads as UserDataCollection,
		commentsCollection: hiddenComments as UserDataCollection,
		createThreadRecord(channelId: Channel['id'], threadId: Thread['id']) {
			operations.push(() => userData.addHiddenThread(channelId, threadId))
		},
		createCommentRecord(channelId: Channel['id'], threadId: Thread['id'], commentId: Comment['id']) {
			operations.push(() => userData.addHiddenComment(channelId, threadId, commentId))
		},
		collectionType: CHANNEL_THREAD_COMMENT_IDS_COLLECTION_TYPE,
		userData
	})

	// Fix `ownThreads`/`ownComments` collection.
	fixThreadsData({
		threadsCollection: ownThreads as UserDataCollection,
		commentsCollection: ownComments as UserDataCollection,
		createThreadRecord(channelId: Channel['id'], threadId: Thread['id']) {
			operations.push(() => userData.addOwnThread(channelId, threadId))
		},
		createCommentRecord(channelId: Channel['id'], threadId: Thread['id'], commentId: Comment['id']) {
			operations.push(() => userData.addOwnComment(channelId, threadId, commentId))
		},
		collectionType: CHANNEL_THREAD_COMMENT_IDS_COLLECTION_TYPE,
		userData
	})

	// Fix `threadVotes`/`commentVotes` collection.
	fixThreadsData({
		threadsCollection: threadVotes as UserDataCollection,
		commentsCollection: commentVotes as UserDataCollection,
		createThreadRecord(channelId: Channel['id'], threadId: Thread['id'], vote: -1 | 1) {
			operations.push(() => userData.setThreadVote(channelId, threadId, vote))
		},
		createCommentRecord(channelId: Channel['id'], threadId: Thread['id'], commentId: Comment['id'], vote: -1 | 1) {
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
}: {
	threadsCollection: UserDataCollection,
	commentsCollection: UserDataCollection,
	createThreadRecord:(channelId: Channel['id'], threadId: Thread['id'], threadData: any) => void,
	createCommentRecord: (channelId: Channel['id'], threadId: Thread['id'], commentId: Comment['id'], commentData: any) => void,
	collectionType: typeof CHANNEL_THREAD_COMMENT_DATA_COLLECTION_TYPE | typeof CHANNEL_THREAD_COMMENT_IDS_COLLECTION_TYPE,
	userData: UserData
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

	const threadsIncludedInCommentsData: Record<string, Array<Thread['id']>> = {}

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
			if (!threadIdsIncludedInCommentsData.includes(Number(threadId))) {
				createCommentRecord(
					channelId,
					Number(threadId),
					Number(threadId),
					getThreadData(threadsData[channelId], Number(threadId))
				)
			}
		}
	}
}

const CHANNEL_THREAD_COMMENT_IDS_COLLECTION_TYPE = {
	isIncludedInCommentsData(commentsData: Record<string, any>, commentId: Comment['id']) {
		return commentsData.includes(commentId)
	},
	getCommentData(commentsData: Record<string, any>, commentId: Comment['id']): any {
		return undefined
	},
	isIncludedInThreadsData(threadsData: Array<Thread['id']>, threadId: Thread['id']) {
		return threadsData.includes(threadId)
	},
	createEmptyThreadsData(): Array<Thread['id']> {
		return []
	},
	getThreadIds(threadsData: Array<Thread['id']>): Array<Thread['id']> {
		return threadsData
	},
	getThreadData(threadsData: Record<string, any>, threadId: Thread['id']): any {
		return undefined
	},
	addThreadData(threadsData: Record<string, any>, threadId: Thread['id'], threadData: any) {
		threadsData.push(threadId)
		threadsData.sort()
	}
}

const CHANNEL_THREAD_COMMENT_DATA_COLLECTION_TYPE = {
	isIncludedInCommentsData(commentsData: Record<string, any>, commentId: Comment['id']) {
		return commentsData.hasOwnProperty(String(commentId))
	},
	getCommentData(commentsData: Record<string, any>, commentId: Comment['id']) {
		return commentsData[String(commentId)]
	},
	isIncludedInThreadsData(threadsData: Record<string, any>, threadId: Thread['id']) {
		return threadsData.hasOwnProperty(String(threadId))
	},
	createEmptyThreadsData() {
		return {}
	},
	getThreadIds(threadsData: Record<string, any>): Array<Thread['id']> {
		return Object.keys(threadsData).map(Number)
	},
	getThreadData(threadsData: Record<string, any>, threadId: Thread['id']) {
		return threadsData[String(threadId)]
	},
	addThreadData(threadsData: Record<string, any>, threadId: Thread['id'], threadData: any) {
		threadsData[String(threadId)] = threadData
	}
}