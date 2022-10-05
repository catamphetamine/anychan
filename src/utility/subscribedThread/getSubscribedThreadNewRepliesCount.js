import getUserData from '../../UserData.js'

import findIndexByIdOrClosestPreviousOne from '../findIndexByIdOrClosestPreviousOne.js'

/**
 * Returns the count of new (unread) replies in a subscribed thread.
 * @param  {object} subscribedThread — Subscribed thread record from `UserData`.
 * @param  {object} [options.userData] — Custom `UserData` instance (is used in tests).
 * @return {number}
 */
export default function getSubscribedThreadNewRepliesCount(subscribedThread, { userData = getUserData() } = {}) {
	// If a thread has expired then don't show a "has new comments" icon.
	// The rationale is that the user won't be able to read those new comments anyway.
	if (subscribedThread.expired) {
		return 0
	}

	const subscribedThreadStats = userData.getSubscribedThreadStats(subscribedThread.channel.id, subscribedThread.id)

	if (!subscribedThreadStats) {
		console.error(`"subscribedThreadsState" record not found for subscribed thread "/${subscribedThread.channel.id}/${subscribedThread.id}"`)
		return 0
	}

	return subscribedThreadStats.newRepliesCount
}

// export default function getSubscribedThreadNewRepliesCount(subscribedThread, { userData = UserData } = {}) {
// 	// If a thread has expired then don't show a "has new comments" icon.
// 	// The rationale is that the user won't be able to read those new comments anyway.
// 	if (subscribedThread.expired) {
// 		return 0
// 	}
//
// 	if (!subscribedThread.replies) {
// 		return 0
// 	}
//
// 	if (subscribedThread.replies.length === 0) {
// 		return 0
// 	}
//
// 	// Show comments starting from the comment,
// 	// that's immediately after the latest read one.
// 	const latestReadCommentInfo = userData.getLatestReadComment(
// 		subscribedThread.channel.id,
// 		subscribedThread.id
// 		// { archive: subscribedThread.archived }
// 	)
//
// 	if (!latestReadCommentInfo) {
// 		return 0
// 	}
//
// 	const latestReadReplyIndex = findIndexByIdOrClosestPreviousOne(
// 		subscribedThread.replies,
// 		latestReadCommentInfo.id,
// 		id => id
// 	)
//
//  // Latest read reply index could be `-1`:
// 	// That could be the case when a thread is a "trimming" one
// 	// and previously read comments already got erased.
// 	// In that case, all existing replies are "new".
// 	return subscribedThread.replies.length - (latestReadReplyIndex + 1)
// }