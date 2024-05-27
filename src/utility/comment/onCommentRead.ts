import type { UserData, Channel, Thread, Comment } from '@/types'
import type { Dispatch } from 'redux'

import { onCommentRead as onCommentReadAction } from '../../redux/thread.js'
import { updateSubscribedThreadState } from '../../redux/subscribedThreads.js'

import createSubscribedThreadStateRecord from '../subscribedThread/createSubscribedThreadStateRecord.js'
import reSortSubscribedThreads from '../subscribedThread/reSortSubscribedThreads.js'

interface Parameters {
	channelId: Channel['id'];
	threadId: Thread['id'];
	commentId: Comment['id'];
	commentIndex: number;
	channel: Channel;
	thread: Thread;
	dispatch: Dispatch;
	userData: UserData;
}

export default function onCommentRead({
	channelId,
	threadId,
	commentId,
	commentIndex,
	channel,
	thread,
	dispatch,
	userData
}: Parameters) {
	userData.setLatestReadCommentId(channelId, threadId, commentId)

	// If this thread is subscribed to, then update "new comments" counter
	// for this thread in "thread subscriptions" list in the Sidebar.
	const subscribedThreadState = userData.getSubscribedThreadState(channelId, threadId)
	if (subscribedThreadState) {
		dispatch(updateSubscribedThreadState({
			channelId,
			threadId,
			prevSubscribedThreadState: subscribedThreadState,
			newSubscribedThreadState: createSubscribedThreadStateRecord(thread, {
				// Retain the `refreshedAt` timestamp because the thread hasn't been updated,
				// it's just that some previously-unread comment in it has been read.
				refreshedAt: subscribedThreadState.refreshedAt,
				userData
			}),
			userData
		}))
	}

	// console.log('Comment read:', commentId, 'from', '/' + channelId + '/' + threadId)

	// Update thread auto-update "new comments" state after this comment has been "read".
	dispatch(onCommentReadAction({
		channelId,
		threadId,
		commentId,
		commentIndex,
		userData
	}))
}