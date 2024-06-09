import type { State, Channel, Thread, Comment, UserData, ChannelFromDataSource, ThreadFromDataSource } from '@/types'

import { ReduxModule } from 'react-pages'

import getLatestReadCommentIndex from '../utility/thread/getLatestReadCommentIndex.js'
import mergePrevAndNewThreadComments from '../utility/thread/mergePrevAndNewThreadComments.js'
import getNewCommentsCount from '../utility/thread/getNewCommentsCount.js'
import getNewRepliesCount from '../utility/thread/getNewRepliesCount.js'

// This redux module name is used in tests so don't remove it.
const redux = new ReduxModule<State['thread']>('THREAD')

export const setThread = redux.simpleAction(
	(state, {
		channels,
		channel: channelInfo,
		thread,
		requestedBy
	}: {
		channels?: Channel[],
		channel?: ChannelFromDataSource,
		thread: ThreadFromDataSource,
		requestedBy?: 'auto-update'
	}) => {
		// Get the current `channel`.
		const channel = getChannelObjectForChannelId(thread.channelId, {
			channel: channelInfo,
			channels,
			relatedChannel: state.channel
		})

		// Set some "utility" properties on `thread`.
		setThreadPropertiesFromChannelProperties(thread, channel)

		// Added these assignments to fix TypeScript errors.
		const channel_ = channel as Channel
		const thread_ = thread as Thread

		return {
			...state,
			...AUTO_UPDATE_NO_NEW_COMMENTS_STATE,
			channel: channel_,
			thread: thread_,
			threadFetchedAt: Date.now(),
			threadFetchedBy: requestedBy
		}
	}
)

export const resetAutoUpdateNewCommentsIndication = redux.simpleAction(
	(state) => ({
		...state,
		...AUTO_UPDATE_NO_NEW_COMMENTS_STATE
	})
)

export const setThreadBeingFetched = redux.simpleAction(
	(state, threadBeingFetched) => {
		return {
			...state,
			threadBeingFetched
		}
	}
)

export const setThreadIsBeingRefreshed = redux.simpleAction(
	(state, threadIsBeingRefreshed: boolean) => {
		return {
			...state,
			threadIsBeingRefreshed
		}
	}
)

export const setThreadRefreshed = redux.simpleAction(
	(state, {
		thread,
		threadBeforeRefresh,
		channels,
		userData,
		requestedBy
	}: {
		thread: Thread,
		threadBeforeRefresh: Thread,
		channels: Channel[],
		userData: UserData,
		requestedBy: 'auto-update'
	}) => {
		// Some code for testing thread auto-update "new comments" / "new replies" notifications.
		// Can be removed.
		//
		// const latestComment = updatedThread.comments[updatedThread.comments.length - 1]
		// userData.addOwnComment(thread.channelId, thread.id, latestComment.id)
		// const fakeNewComment = {
		// 	...latestComment,
		// 	id: Date.now()
		// }
		// updatedThread.comments.push(fakeNewComment)
		// latestComment.replies = latestComment.replies || []
		// latestComment.replies.push(fakeNewComment)

		mergePrevAndNewThreadComments(threadBeforeRefresh, thread)

		// Get the current `channel`.
		const channel = getChannelObjectForChannelId(thread.channelId, { channels, channel: state.channel })
		setThreadPropertiesFromChannelProperties(thread, channel)

		const prevCommentsCount = state.thread && state.thread.comments.length

		return {
			...state,
			...getAutoUpdateNewCommentsState(state, thread, { prevCommentsCount, userData }),
			thread,
			threadFetchedAt: Date.now(),
			threadFetchedBy: requestedBy
		}
	}
)

// This action is currently not used.
// `onCommentRead()` action is used instead.
//
// export const refreshAutoUpdateNewCommentsState = redux.simpleAction(
// 	(state, { channelId, threadId, userData }) => {
// 		// Use the previously fetched thread data, if any,
// 		// to re-calculate the "new" ("unread") comments' indexes.
// 		const { thread } = state
// 		if (thread) {
// 			if (thread.id === threadId && thread.channelId === channelId) {
// 				return {
// 					...state,
// 					...getAutoUpdateNewCommentsState(state, thread, { userData })
// 				}
// 			}
// 		}
// 		return state
// 	}
// )

export const markCurrentThreadAsExpired = redux.simpleAction(
	(state) => ({
		...state,
		thread: {
			...state.thread,
			expired: true
		}
	})
)

// This function might hypothetically get called "out of sync":
// it is triggered from `IntersectionObserver`s and it's not clear
// whether those follow any event callback execution order or something.
export const onCommentRead = redux.simpleAction(
	// This action name is used in tests, so don't remove it.
	'ON_COMMENT_READ',
	(state, {
		channelId,
		threadId,
		commentId,
		commentIndex,
		userData
	}: {
		channelId: Channel['id'],
		threadId: Thread['id'],
		commentId: Comment['id'],
		commentIndex: number,
		userData: UserData
	}) => {
		const { thread } = state
		// If the comment has been read in a currently viewed thread.
		// (which should be the case, unless there's some "race condition")
		if (thread && thread.channelId === channelId && thread.id === threadId) {
			// If this comment was the last "new" one in this thread,
			// then reset "first new comment" and "last new comment" indexes
			// of the ongoing auto-update process.
			if (state.autoUpdateLastNewCommentId === commentId) {
				return {
					...state,
					...AUTO_UPDATE_NO_NEW_COMMENTS_STATE
				}
			}

			// This function could be called "out of sync", as its description says.
			// So, it's not guaranteed to be called with the actual latest read comment ID.
			// Because of that, perform an additional check that there're no "race conditions".
			const {
				autoUpdateFirstNewCommentIndex,
				autoUpdateLastNewCommentIndex,
				autoUpdateUnreadCommentsCount
			} = state

			// If this "on comment read" event came too late
			// (after all new auto-update comments have already been read),
			// then just ignore it.
			if (autoUpdateFirstNewCommentIndex === undefined) {
				// Ignore. This "on comment read" event came after some other
				// "on comment read" event that was triggered for a later comment
				// which also happened to be the latest one currently in the thread,
				// therefore auto-update "new comments" state was already reset.
			}
			else {
				// If no comment index info was passed, then
				// re-calculate thread auto-update state parameters from scratch.
				//
				// For example, `commentIndex` is `undefined` when `onCommentRead()`
				// is called in response to an external `UserData` update (`latestReadComments` collection).
				// In that case, `commentIndex` could be obtained only if it was stored
				// along with the `commentId` in an entry of the collection.
				// But even if `commentIndex` was stored in the same record as `commentId`,
				// it could still be out of bounds if the current tab, assuming it's a Thread page,
				// hasn't fetched the most-latest comments yet.
				// Analogous, `commentIndex` could be incorrect if the current tab still retains
				// some previous comment that has been deleted since then, and the external change
				// was made after that previous comment was deleted.
				// In other words, it's not guaranteed that two different tabs have the same
				// "view" of the list of comments in a thread: those lists might differ
				// either due to new comments being added or some prior comments being removed.
				// So in those cases it's safer to re-calculate things as if `commentIndex` parameter
				// to this function didn't exist.
				//
				if (commentIndex === undefined) {
					return {
						...state,
						...getAutoUpdateNewCommentsState(state, thread, { userData })
					}
				}

				// If `commentIndex` is not `undefined` then it means that the `onCommentRead()`
				// action was dispatched from the current tab as a result of actually reading
				// the comment.

				// This thread appears to have some "new comments" loaded by auto-update.
				// Check to see if this "on comment read" event came after some other
				// "on comment read" event that was triggered for a later comment.
				// To check that, compare the "unread comments" count before and after
				// processing this "on comment read" event: if the "unread comments" count
				// would become smaller than that would mean that this "on comment read"
				// event came "out of sync" (too late) and should be ignored.
				const newAutoUpdateUnreadCommentsCount = autoUpdateLastNewCommentIndex - commentIndex
				if (newAutoUpdateUnreadCommentsCount < autoUpdateUnreadCommentsCount) {
					// Here, it could simply decrease the "unread comments count" number
					// by `justReadCommentIndex - autoUpdateLastNewCommentIndex` to get the new
					// "unread comments count".
					// But it wouldn't account for "own" comments that shouldn't be counted as "new"
					// or "unread".
					// So it'll have to re-calculate the "new comments count" number from scratch.
					return {
						...state,
						// autoUpdateUnreadCommentsCount: newAutoUpdateUnreadCommentsCount,
						autoUpdateUnreadCommentsCount: getNewCommentsCount(thread, {
							fromCommentIndex: commentIndex + 1,
							userData
						}),
						autoUpdateUnreadRepliesCount: getNewRepliesCount(thread, {
							fromCommentIndex: commentIndex + 1,
							userData
						})
					}
				}
			}
		}

		return state
	}
)

export default redux.reducer()

export function getChannelObjectForChannelId(channelId: Channel['id'], {
	// `channel` is the channel info that was returned from "get threads" API response.
	channel,

	// When a user navigates from a channel page to a thread page,
	// `relatedChannel` should be channel it navigated from.
	// This channel info could be used for the thread page
	// because it's the same channel.
	// But it should still compare both channel IDs in order to avoid situations
	// when a user visits channel `/a` and then clicks on a "bookmarked" thread
	// `/b/123` in the sidebar: in that situation, `relatedChannel` `/a` shouldn't be used
	// as a source for channel info for thread `/b/123`.
	relatedChannel,

	// `channels` is a cached list of channels that're avaiable at the datasource.
	// Although it's not a complete list, it might be possible that the channel with the ID
	// could be found there.
	channels
}: {
	channel?: Channel,
	relatedChannel?: Channel,
	channels?: Channel[]
}): Channel {
	// If channel info was returned from the API then use it.
	if (channel) {
		return channel
	}
	// If channel info was returned from the API then use it.
	if (relatedChannel && relatedChannel.id === channelId) {
		return relatedChannel
	}
	// The list of channels is usually pre-fetched on app startup.
	// Although it's not necessarily a complete list of channels,
	// there might be a channel with such ID there.
	if (channels) {
		const channel = channels.find(_ => _.id === channelId)
		if (channel) {
			return channel
		}
	}
	// If channel info wasn't present in the API response and not found in the cache,
	// return a "dummy" channel object, with the `id` set to `channelId`,
	// and the `title` also set to `channelId` because `title` is a required property.
	return {
		id: channelId,
		title: channelId,
		post: {},
		features: {}
	}
}

// Some comment properties are set here
// rather than in `addCommentProps.js`
// because here it requires access to channel props
// which aren't available in `addCommentProps.js`.
export function setThreadPropertiesFromChannelProperties(thread: ThreadFromDataSource, channel: Channel) {
	// `2ch.hk` and `4chan.org` provide `bumpLimit` info.
	// Mark all comments that have reached that "bump limit".
	if (channel.features?.bumpLimit && !(thread.trimming || thread.pinned)) {
		if (thread.comments.length >= channel.features.bumpLimit) {
			let i = channel.features.bumpLimit
			while (i < thread.comments.length) {
				// `bumpLimitReached` is used in `<CommentAuthor/>`
				// to show a "sinking ship" badge.
				(thread.comments[i] as Comment).isOverBumpLimit = true
				i++
			}
		}
	}
}

const AUTO_UPDATE_NO_NEW_COMMENTS_STATE: Partial<State['thread']> = {
	// If adding new properties here, also add those properties
	// everywhere else in this file.
	autoUpdateFirstNewCommentIndex: undefined,
	autoUpdateLastNewCommentIndex: undefined,
	autoUpdateFirstNewCommentId: undefined,
	autoUpdateLastNewCommentId: undefined,
	autoUpdateUnreadCommentsCount: 0,
	autoUpdateUnreadRepliesCount: 0
}

// `prevCommentsCount` parameter is only passed when called after a thread refresh.
function getAutoUpdateNewCommentsState(
	state: State['thread'],
	thread: Thread,
	{
		prevCommentsCount,
		userData
	}: {
		prevCommentsCount?: number,
		userData: UserData
	}
) {
	let {
		// If adding new properties here, also add those properties
		// to `AUTO_UPDATE_NO_NEW_COMMENTS_STATE`.
		autoUpdateFirstNewCommentIndex,
		autoUpdateLastNewCommentIndex,
		autoUpdateFirstNewCommentId,
		autoUpdateLastNewCommentId,
		autoUpdateUnreadCommentsCount,
		autoUpdateUnreadRepliesCount
	} = state

	// Only start showing the "new auto-updated comments available" start line if
	// the comment right before that line has already been "read" by the user.
	//
	// In other words, if there were any unread comments before the first auto-update,
	// then don't show the "new comments available" horizontal divider line,
	// even if there're more new comments after the auto-update.
	//
	// This fixes the cases when the user navigates to a thread,
	// scrolls almost to the last comment (but not to the last one),
	// the auto-update process is triggered and pulls some new comments,
	// but since the user hasn't actually seen the prevously "last" comment,
	// it doesn't make much sense to treat this situation as "new comments are available"
	// (along with showing a notification). That's because there have already been
	// "unread comments" before the auto-update, and as long there're "unread comments",
	// it doesn't really matter how much of them is there, so it doesn't really matter
	// that now there's more "unread comments" than before.
	//
	if (autoUpdateFirstNewCommentIndex === undefined) {
		if (prevCommentsCount !== undefined) {
			const latestReadCommentIndex = getLatestReadCommentIndex(thread, { userData })
			if (latestReadCommentIndex !== undefined) {
				// If there already were any unread comments before the auto-update.
				if (latestReadCommentIndex < prevCommentsCount - 1) {
					// Leave the auto-update state unchanged.
					return {
						// If adding new properties here, also add those properties
						// to `AUTO_UPDATE_NO_NEW_COMMENTS_STATE`.
						autoUpdateFirstNewCommentIndex,
						autoUpdateLastNewCommentIndex,
						autoUpdateFirstNewCommentId,
						autoUpdateLastNewCommentId,
						autoUpdateUnreadCommentsCount,
						autoUpdateUnreadRepliesCount
					}
				}
				// Alternatively, if using `id` instead of `i`:
				// const previousLatestComment = thread.comments[prevCommentsCount - 1]
				// if (latestReadCommentInfo.id < previousLatestComment.id) {
				// 	return ...
				// }
			}
		}
	}

	const totalCommentsCount = thread.comments.length

	if (totalCommentsCount === prevCommentsCount) {
		// Leave the auto-update state unchanged.
		return {
			// If adding new properties here, also add those properties
			// to `AUTO_UPDATE_NO_NEW_COMMENTS_STATE`.
			autoUpdateFirstNewCommentIndex,
			autoUpdateLastNewCommentIndex,
			autoUpdateFirstNewCommentId,
			autoUpdateLastNewCommentId,
			autoUpdateUnreadCommentsCount,
			autoUpdateUnreadRepliesCount
		}
	}

	// Get new comments count after the auto-update.
	//
	// Here, it could simply adjust the "unread comments count" number
	// by `latestCommentIndex - autoUpdateLastNewCommentIndex` to get the new
	// "unread comments count".
	// But it wouldn't account for "own" comments that shouldn't be counted as "new"
	// or "unread".
	// So it'll have to re-calculate the "new comments count" number from scratch.
	//
	// let newCommentsCount
	// if (prevCommentsCount !== undefined) {
	// 	newCommentsCount = totalCommentsCount - prevCommentsCount
	// } else {
	// 	if (autoUpdateFirstNewCommentIndex === undefined) {
	// 		newCommentsCount = 0
	// 	} else {
	// 		newCommentsCount = (thread.comments.length - 1) - autoUpdateFirstNewCommentIndex
	// 	}
	// }
	//
	const newCommentsCount = getNewCommentsCount(thread, { userData })

	if (newCommentsCount === 0) {
		return AUTO_UPDATE_NO_NEW_COMMENTS_STATE
	}

	// Compute auto-update new comments state properties.

	autoUpdateFirstNewCommentIndex = totalCommentsCount - newCommentsCount
	autoUpdateFirstNewCommentId = thread.comments[autoUpdateFirstNewCommentIndex].id

	autoUpdateLastNewCommentIndex = totalCommentsCount - 1
	autoUpdateLastNewCommentId = thread.comments[autoUpdateLastNewCommentIndex].id

	autoUpdateUnreadCommentsCount = newCommentsCount

	autoUpdateUnreadRepliesCount = getNewRepliesCount(thread, {
		fromCommentIndex: autoUpdateFirstNewCommentIndex,
		userData
	})

	return {
		// If adding new properties here, also add those properties
		// to `AUTO_UPDATE_NO_NEW_COMMENTS_STATE`.
		autoUpdateFirstNewCommentIndex,
		autoUpdateLastNewCommentIndex,
		autoUpdateFirstNewCommentId,
		autoUpdateLastNewCommentId,
		autoUpdateUnreadCommentsCount,
		autoUpdateUnreadRepliesCount
	}
}