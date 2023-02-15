import { ReduxModule } from 'react-pages'

import getMessages from '../messages/index.js'
import getLatestReadCommentIndex from '../utility/thread/getLatestReadCommentIndex.js'
import mergePrevAndNewThreadComments from '../utility/thread/mergePrevAndNewThreadComments.js'
import getNewCommentsCount from '../utility/thread/getNewCommentsCount.js'
import getNewRepliesCount from '../utility/thread/getNewRepliesCount.js'

// import _getChannels from '../api/getChannels.js'
import _getChannelsCached from '../api/cached/getChannels.js'
import _getThreads from '../api/getThreads.js'
import _getThread from '../api/getThread.js'
import _vote from '../api/vote.js'

import getUserData from '../UserData.js'

const redux = new ReduxModule('DATA')

export const getChannels = redux.action(
	({ all } = {}) => async http => await _getChannelsCached({
		// In case of adding new options here,
		// also add them in `./src/api/cached/getChannels.js`
		// and `./src/components/settings/ProxySettings.js`.
		http,
		all
	}),
	(state, result) => ({
		...state,
		// `result` has `channels` and potentially other things
		// like `channelsByCategory` and `channelsByPopularity`.
		// Also contains `allChannels` object in case of `all: true`.
		...result
	})
)

export const getThreads = redux.action(
	(channelId, {
		censoredWords,
		grammarCorrection,
		locale,
		withLatestComments,
		sortByRating,
		userData = getUserData()
	}) => async http => {
		const threads = await _getThreads({
			channelId,
			censoredWords,
			grammarCorrection,
			locale,
			messages: getMessages(locale),
			withLatestComments,
			sortByRating,
			http,
			userData
		})
		return { channelId, threads }
	},
	(state, { channelId, threads }) => {
		// Get the current `channel`.
		const channel = getChannelObject(state, channelId)
		// `2ch.hk` doesn't specify most of the board settings in `/boards.json` API response.
		// Instead, it returns the board settings as part of "get threads" and
		// "get thread comments" API responses.
		if (threads.length > 0) {
			populateChannelInfoFromThreadData(channel, threads[0])
			for (const thread of threads) {
				setThreadInfo(thread, channel)
			}
		}
		return {
			...state,
			channel,
			threads
		}
	}
)

export const getThread = redux.action(
	(channelId, threadId, {
		archived,
		censoredWords,
		grammarCorrection,
		locale,
		userData
	}) => async http => {
		return await _getThread({
			channelId,
			threadId,
			...{
				archived,
				censoredWords,
				grammarCorrection,
				locale
			},
			messages: getMessages(locale),
			http,
			userData
		})
	},
	(state, thread) => {
		// Get the current `channel`.
		const channel = getChannelObject(state, thread.channelId)
		// `2ch.hk` doesn't specify most of the board settings in `/boards.json` API response.
		// Instead, it returns the board settings as part of "get threads" and
		// "get thread comments" API responses.
		populateChannelInfoFromThreadData(channel, thread)
		setThreadInfo(thread, channel)
		return {
			...state,
			...AUTO_UPDATE_NO_NEW_COMMENTS_STATE,
			channel,
			thread,
			threadRefreshedAt: Date.now()
		}
	}
)

export const resetAutoUpdateNewCommentsIndication = redux.simpleAction(
	(state) => ({
		...state,
		...AUTO_UPDATE_NO_NEW_COMMENTS_STATE
	})
)

export const refreshThread = redux.action(
	(thread, {
		censoredWords,
		grammarCorrection,
		locale,
		userData
	}) => async http => {
		const updatedThread = await _getThread({
			channelId: thread.channelId,
			threadId: thread.id,
			...{
				// `threadBeforeRefresh` feature is not currently used, but `imageboard` library
				// still supports using the "-tail" data URL when fetching thread comments
				// on `4chan.org` to reduce the traffic a bit. See `4chan.org` API docs
				// of the `imageboard` library for more details on how "-tail" data URL works.
				// This feature hasn't been tested and is not currently used.
				// threadBeforeRefresh: thread,
				censoredWords,
				grammarCorrection,
				locale
			},
			messages: getMessages(locale),
			http,
			userData
		})
		mergePrevAndNewThreadComments(thread, updatedThread)
		return {
			thread: updatedThread,
			prevCommentsCount: thread.comments.length
		}
	},
	(state, { thread, prevCommentsCount }) => {
		// Get the current `channel`.
		const channel = getChannelObject(state, thread.channelId)
		setThreadInfo(thread, channel)
		return {
			...state,
			...getAutoUpdateNewCommentsState(state, thread, { prevCommentsCount }),
			thread,
			threadRefreshedAt: Date.now()
		}
	}
)

// This action is currently not used.
// `onCommentRead()` action is used instead.
//
// export const refreshAutoUpdateNewCommentsState = redux.simpleAction(
// 	(state, { channelId, threadId }) => {
// 		// Use the previously fetched thread data, if any,
// 		// to re-calculate the "new" ("unread") comments' indexes.
// 		const { thread } = state
// 		if (thread) {
// 			if (thread.id === threadId && thread.channelId === channelId) {
// 				return {
// 					...state,
// 					...getAutoUpdateNewCommentsState(state, thread)
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
	'ON_COMMENT_READ',
	(state, { channelId, threadId, commentId, commentIndex }) => {
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
						...getAutoUpdateNewCommentsState(state, thread)
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
							fromCommentIndex: commentIndex + 1
						}),
						autoUpdateUnreadRepliesCount: getNewRepliesCount(thread, {
							fromCommentIndex: commentIndex + 1
						})
					}
				}
			}
		}

		return state
	}
)

export const vote = redux.action(
	({ up, channelId, threadId, commentId, userData = getUserData() }) => async http => {
		const voteAccepted = await _vote({
			up,
			channelId,
			commentId,
			http
		})
		// If the vote has been accepted then mark this comment as "voted" in user data.
		// If the vote hasn't been accepted due to "already voted"
		// then also mark this comment as "voted" in user data.
		userData.setCommentVote(channelId, threadId, commentId, up ? 1 : -1) // , { archive: false })
		return voteAccepted
	}
)

export default redux.reducer()

function getChannelObject(state, channelId) {
	// Sometimes all channels are pre-fetched (when there's a small amount of them).
	// In those cases, find the channel by its `id` in the list of pre-fetched channels.
	if (state.channels) {
		const channel = state.channels.find(_ => _.id === channelId)
		if (channel) {
			return channel
		}
	}
	// In other cases (for example, on `8ch.net`, where there're about 20 000 "user boards"),
	// construct a new channel object based on the available info.
	// If such channel object has already been constructed before, then use it.
	if (state.channel && state.channel.id === channelId) {
		return state.channel
	}
	// Return a "dummy" channel object, with the `id` being `channelId`,
	// and the `title` also being `channelId` (because `title` is a required property).
	return {
		id: channelId,
		title: channelId
	}
}

function populateChannelInfoFromThreadData(channel, thread) {
	// `2ch.hk` doesn't specify most of the board settings in `/boards.json` API response.
	// Instead, it returns the board settings as part of "get threads" and
	// "get thread comments" API responses.
	// Also, imageboards like `lynxchan`, having "userboards", return board title
	// as part of "get thread comments" API response.
	if (thread.board) {
		for (const key of Object.keys(thread.board)) {
			channel[key] = thread.board[key]
		}
		delete thread.board
	}
}

// Some comment properties are set here
// rather than in `addCommentProps.js`
// because here it requires access to channel props
// which aren't available in `addCommentProps.js`.
function setThreadInfo(thread, channel) {
	// `2ch.hk` and `4chan.org` provide `bumpLimit` info.
	// Mark all comments that have reached that "bump limit".
	if (channel.bumpLimit && !(thread.trimming || thread.onTop)) {
		if (thread.comments.length >= channel.bumpLimit) {
			let i = channel.bumpLimit
			while (i < thread.comments.length) {
				// `bumpLimitReached` is used in `<CommentAuthor/>`
				// to show a "sinking ship" badge.
				thread.comments[i].isOverBumpLimit = true
				i++
			}
		}
	}
}

const AUTO_UPDATE_NO_NEW_COMMENTS_STATE = {
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
function getAutoUpdateNewCommentsState(state, thread, { prevCommentsCount } = {}) {
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
			const latestReadCommentIndex = getLatestReadCommentIndex(thread)
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
	const newCommentsCount = getNewCommentsCount(thread)

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
		fromCommentIndex: autoUpdateFirstNewCommentIndex
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