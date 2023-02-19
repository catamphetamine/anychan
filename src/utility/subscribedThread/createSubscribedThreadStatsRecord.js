import { encodeDate } from '../../UserData/compression.js'

import getFirstNewCommentIndex from '../thread/getFirstNewCommentIndex.js'
import getNewCommentsCount from '../thread/getNewCommentsCount.js'
import getNewRepliesCount from '../thread/getNewRepliesCount.js'

export default function createSubscribedThreadStatsRecord(thread, {
	refreshedAt,
	userData
}) {
	// In case of an "incremental" thread update.
	// This feature is not currently used.
	if (thread.afterCommentId) {
		throw new Error('Can\'t create a subscribed thread stats record from an "incremental" thread update data')
	}

	// Create `subscribedThreadsStats` record.
	let newCommentsCount = 0
	let newRepliesCount = 0

	const firstNewCommentIndex = getFirstNewCommentIndex(thread, { userData })
	if (firstNewCommentIndex !== undefined) {
		newCommentsCount = getNewCommentsCount(thread, {
			fromCommentIndex: firstNewCommentIndex,
			userData
		})
		newRepliesCount = getNewRepliesCount(thread, {
			fromCommentIndex: firstNewCommentIndex,
			userData
		})
	}

	const commentsCount = thread.comments.length
	const latestComment = thread.comments[thread.comments.length - 1]

	return {
		refreshedAt,
		commentsCount,
		newCommentsCount,
		newRepliesCount,
		latestComment: {
			id: latestComment.id,
			createdAt: latestComment.createdAt
		}
	}
}

// This record is created when it's found out that no "stats" record
// exists for the subscribed thread in `UserData` (fixes data corruption).
export function createSubscribedThreadStatsRecordStubEncoded(subscribedThread) {
	return {
		refreshedAt: encodeDate(subscribedThread.addedAt),
		latestComment: {
			// This is the ID of the first comment rather than the ID of the latest comment,
			// but it still works. The ID of the latest comment isn't currently used anyway.
			id: subscribedThread.id,
			createdAt: encodeDate(subscribedThread.addedAt)
		},
		// The comments count of `1` is, obviously, not true, but it doesn't really matter,
		// because `commentsCount` is currently only used to check if "incremental" thread update
		// could be used.
		commentsCount: 1,
		newCommentsCount: 0,
		newRepliesCount: 0
	}
}

// Creates a subscribed thread stats record in case of an "incremental" thread update.
//
// An "incremental" thread update won't detect deleted comments.
//
// Returns `undefined` if a subscribed thread stats record couldn't be created.
//
export function createSubscribedThreadStatsRecordForIncrementalUpdate(thread, {
	prevStats,
	refreshedAt,
	userData
}) {
	// Check that all comments required for an "incremental" update are present in the data.
	if (thread.afterCommentId > prevStats.latestComment.id) {
		console.error('Incremental update after comment ID', thread.afterCommentId)
		console.error('Prevous latest comment ID', prevStats.latestComment.id)
		console.error('createSubscribedThreadStatsRecordForIncrementalUpdate(): the "incremental" thread update data is not enough for getting the new comments count')
		return
	}

	// Will update new comments count and new replies count.
	let {
		commentsCount,
		newCommentsCount,
		newRepliesCount
	} = prevStats

	// * The previous latest comment might have been deleted.
	// * The incremental thread update result might not include the previous latest comment.
	const prevLatestCommentIndex = findIndexByIdOrClosestPreviousOne(thread.comments, prevStats.latestComment.id)
	const firstNewCommentIndex = prevLatestCommentIndex === undefined
		? 0
		: (prevLatestCommentIndex === thread.comments.length - 1
			? undefined
			: prevLatestCommentIndex + 1
		)

	// If there're no new comments, then return the previous stats.
	if (firstNewCommentIndex === undefined) {
		return {
			...prevStats,
			refreshedAt
		}
	}

	// Update comments count.
	commentsCount += thread.comments.length - firstNewCommentIndex

	// Update new comments count.
	newCommentsCount += getNewCommentsCount(thread, {
		fromCommentIndex: firstNewCommentIndex,
		userData
	})

	// Update new replies count.
	newRepliesCount += getNewRepliesCount(thread, {
		fromCommentIndex: firstNewCommentIndex,
		userData
	})

	const latestComment = thread.comments[thread.comments.length - 1]

	return {
		refreshedAt,
		commentsCount,
		newCommentsCount,
		newRepliesCount,
		latestComment: {
			id: latestComment.id,
			createdAt: latestComment.createdAt
		}
	}
}