import { ReduxModule } from 'react-pages'

import getMessages from '../messages'
import mergePrevAndNewThreadComments from '../utility/mergePrevAndNewThreadComments'
import getLatestReadCommentIndex from '../utility/getLatestReadCommentIndex'

// import _getChannels from '../api/getChannels'
import _getChannelsCached from '../api/cached/getChannels'
import _getThreads from '../api/getThreads'
import _getThread from '../api/getThread'
import _vote from '../api/vote'

import UserData from '../UserData/UserData'

const redux = new ReduxModule('DATA')

// export const getChannels = redux.action(
// 	({ all } = {}) => async http => await _getChannels({ http, all }),
// 	(state, result) => ({
// 		...state,
// 		// `result` has `channels` and potentially other things
// 		// like `channelsByCategory` and `channelsByPopularity`.
// 		// Also contains `allChannels` object in case of `all: true`.
// 		...result
// 	})
// )

export const getChannels = redux.action(
	({ all } = {}) => async http => await _getChannelsCached({
		// In case of adding new options here,
		// also add them in `./src/api/cached/getChannels.js`.
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
	(channelId, { censoredWords, grammarCorrection, locale }) => async http => {
		const threads = await _getThreads({
			channelId,
			censoredWords,
			grammarCorrection,
			locale,
			messages: getMessages(locale),
			http
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
	(channelId, threadId, { censoredWords, grammarCorrection, locale }) => async http => {
		return await _getThread({
			channelId,
			threadId,
			censoredWords,
			grammarCorrection,
			locale,
			messages: getMessages(locale),
			http
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

export const resetNewAutoUpdateCommentIndexes = redux.simpleAction(
	(state) => ({
		...state,
		...AUTO_UPDATE_NO_NEW_COMMENTS_STATE
	})
)

export const refreshThread = redux.action(
	(thread, { censoredWords, grammarCorrection, locale }) => async http => {
		const updatedThread = await _getThread({
			channelId: thread.channelId,
			threadId: thread.id,
			censoredWords,
			grammarCorrection,
			locale,
			messages: getMessages(locale),
			http
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
			...getAutoUpdateNewCommentsState(state, thread, prevCommentsCount),
			thread,
			threadRefreshedAt: Date.now()
		}
	}
)

export const markCurrentThreadExpired = redux.simpleAction(
	(state) => ({
		...state,
		thread: {
			...state.thread,
			expired: true
		}
	})
)

export const readComment = redux.simpleAction(
	(state, { channelId, threadId, commentId, commentIndex }) => {
		const { thread } = state
		if (thread.channelId === channelId && thread.id === threadId) {
			// If the "last new comment" has been read, then
			// reset "first new comment" and "last new comment" indexes.
			if (state.lastNewAutoUpdateCommentId === commentId) {
				return {
					...state,
					...AUTO_UPDATE_NO_NEW_COMMENTS_STATE
				}
			} else {
				// This function is hypothetically possible to be called "out of sync":
				// it's not clear what's the order in which various `IntersectionObserver`s'
				// events are triggered. Could be "out of sync" and random by design.
				// So, it's not guaranteed to be called with the latest read comment,
				// so an additional check checks that there're no "race conditions".
				const {
					firstNewAutoUpdateCommentIndex,
					lastNewAutoUpdateCommentIndex,
					unreadAutoUpdateCommentsCount
				} = state
				// If this "comment read" event came too late
				// (after all new auto-update comments have already been read),
				// then just ignore it.
				if (firstNewAutoUpdateCommentIndex !== undefined) {
					// Check to see if the unread auto-update comments count
					// "suggested" by this "comment read" event is less than
					// the current unread auto-update comments count,
					// because the unread auto-update comments count can't grow
					// given the same set of thread comments, otherwise
					// the "comment read" event is "out of sync".
					const suggestedUnreadAutoUpdateCommentsCount = lastNewAutoUpdateCommentIndex - commentIndex
					if (suggestedUnreadAutoUpdateCommentsCount < unreadAutoUpdateCommentsCount) {
						return {
							...state,
							unreadAutoUpdateCommentsCount: suggestedUnreadAutoUpdateCommentsCount
						}
					}
				}
			}
		}
		return state
	}
)

export const vote = redux.action(
	({ up, channelId, threadId, commentId }) => async http => {
		const voteAccepted = await _vote({
			up,
			channelId,
			commentId,
			http
		})
		// If the vote has been accepted then mark this comment as "voted" in user data.
		// If the vote hasn't been accepted due to "already voted"
		// then also mark this comment as "voted" in user data.
		UserData.setCommentVote(channelId, threadId, commentId, up ? 1 : -1)
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
	if (channel.bumpLimit && !(thread.isRolling || thread.isSticky)) {
		if (thread.comments.length >= channel.bumpLimit) {
			let i = channel.bumpLimit
			while (i < thread.comments.length) {
				// `isBumpLimitReached` is used in `<CommentAuthor/>`
				// to show a "sinking ship" badge.
				thread.comments[i].isOverBumpLimit = true
				i++
			}
		}
	}
}

const AUTO_UPDATE_NO_NEW_COMMENTS_STATE = {
	firstNewAutoUpdateCommentIndex: undefined,
	lastNewAutoUpdateCommentIndex: undefined,
	firstNewAutoUpdateCommentId: undefined,
	lastNewAutoUpdateCommentId: undefined,
	unreadAutoUpdateCommentsCount: 0
}

function getAutoUpdateNewCommentsState(state, thread, prevCommentsCount) {
	// Only show the "new auto-updated comments" start line
	// if the comment before that line has been "read" by the user.
	// This fixes the cases when the user navigates to a thread,
	// scrolls almost to the last comment (but not to the last one),
	// the auto-update process is triggered and pulls some new comments,
	// but since the user hasn't actually seen the prevously "last" comment,
	// it doesn't make much sense to differentiate that comment and the
	// new comments that have been pulled during an auto-update:
	// conceptually, both those groups of comments are effectively
	// "initially unread comments", and "initially unread comments"
	// aren't currently marked in any way, so there's no need for a line
	// dividing the initially unread comments and the auto-updated unread ones.
	const latestReadCommentIndex = getLatestReadCommentIndex(thread)
	if (latestReadCommentIndex !== undefined) {
		if (latestReadCommentIndex < prevCommentsCount - 1) {
			return AUTO_UPDATE_NO_NEW_COMMENTS_STATE
		}
		// Alternatively, if using `id` instead of `i`:
		// const previousLatestComment = thread.comments[prevCommentsCount - 1]
		// if (latestReadCommentInfo.id < previousLatestComment.id) {
		// 	return AUTO_UPDATE_NO_NEW_COMMENTS_STATE
		// }
	}
	let {
		firstNewAutoUpdateCommentIndex,
		lastNewAutoUpdateCommentIndex,
		firstNewAutoUpdateCommentId,
		lastNewAutoUpdateCommentId,
		unreadAutoUpdateCommentsCount
	} = state
	const newTotalCommentsCount = thread.comments.length
	const newCommentsCount = newTotalCommentsCount - prevCommentsCount
	if (newCommentsCount > 0) {
		if (firstNewAutoUpdateCommentIndex === undefined) {
			firstNewAutoUpdateCommentIndex = prevCommentsCount
			firstNewAutoUpdateCommentId = thread.comments[firstNewAutoUpdateCommentIndex].id
		}
		lastNewAutoUpdateCommentIndex = newTotalCommentsCount - 1
		lastNewAutoUpdateCommentId = thread.comments[lastNewAutoUpdateCommentIndex].id
		unreadAutoUpdateCommentsCount += newCommentsCount
	}
	return {
		firstNewAutoUpdateCommentIndex,
		lastNewAutoUpdateCommentIndex,
		firstNewAutoUpdateCommentId,
		lastNewAutoUpdateCommentId,
		unreadAutoUpdateCommentsCount
	}
}