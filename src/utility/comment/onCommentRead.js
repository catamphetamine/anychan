import { onCommentRead as onCommentReadAction } from '../../redux/data.js'
import { updateSubscribedThreadStats } from '../../redux/subscribedThreads.js'

import createSubscribedThreadStatsRecord from '../subscribedThread/createSubscribedThreadStatsRecord.js'

export default function onCommentRead({
	channelId,
	threadId,
	commentId,
	commentIndex,
	channel,
	thread,
	dispatch,
	userData
}) {
	userData.setLatestReadCommentId(channelId, threadId, commentId)

	// If this thread is subscribed to, then update "new comments" counter
	// for this thread in "thread subscriptions" list in the Sidebar.
	const subscribedThreadStats = userData.getSubscribedThreadStats(channelId, threadId)
	if (subscribedThreadStats) {
		dispatch(updateSubscribedThreadStats(
			channelId,
			threadId,
			subscribedThreadStats,
			{
				...createSubscribedThreadStatsRecord(thread, { channel, userData }),
				// Retain the `refreshedAt` timestamp because the thread hasn't been updated,
				// it's just that some previously-unread comment in it has been read.
				refreshedAt: subscribedThreadStats.refreshedAt
			},
			{ userData }
		))
	}

	// console.log('Comment read:', commentId, 'from', '/' + channelId + '/' + threadId)

	// Update thread auto-update "new comments" state after this comment has been "read".
	dispatch(onCommentReadAction({
		channelId,
		threadId,
		commentId,
		commentIndex
	}))
}